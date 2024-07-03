package com.trsystem.indvdlClm.domain;

import java.sql.SQLException;
import java.text.ParseException;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.trsystem.common.service.ApplicationYamlRead;
import com.trsystem.common.service.CommonService;
import com.trsystem.email.service.EmailSendService;
import com.trsystem.elecAtrz.domain.ElecAtrzDomain;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Component
public class IndvdlClmDomain {
    private static CommonService commonService;

    private static EmailSendService emailSendService;

    @Autowired
    public IndvdlClmDomain(CommonService commonService, ApplicationYamlRead applicationYamlRead, EmailSendService emailSendService) {
        IndvdlClmDomain.commonService = commonService;
        this.emailSendService = emailSendService;
    }

    @Transactional
    public static int insertPrjctMM(List<Map<String, Object>> params) {
        int result = 0;

        List<Map<String, Object>> mmParam = (List<Map<String, Object>>) params.get(0).get("param");
        List<Map<String, Object>> ctParams = (List<Map<String, Object>>) params.get(1).get("updatedData");

        List<Map<String, Object>> newList = mmParam.stream().distinct().collect(Collectors.toList());
        List<Map<String, Object>> insertList = new ArrayList<>();
        HashMap<String, Object> tbNm = new HashMap<String, Object>();
        tbNm.put("tbNm", "PRJCT_INDVDL_CT_MM");
        insertList.add(tbNm);

        for (int i = 0; i < newList.size(); i++) {
            List<Map<String, Object>> searchList = new ArrayList<>();
            searchList.add(tbNm);
            searchList.add(newList.get(i));

            List<Map<String, Object>> list = commonService.commonSelect(searchList);
            if (list.isEmpty()) {
                insertList.add(newList.get(i));
            }
        }
        result = commonService.insertData(insertList);

        result += insertCtAply(mmParam, ctParams);
        return result;
    }

    @Transactional
    public static int insertCtAply(List<Map<String, Object>> basicParam, List<Map<String, Object>> ctParams) {
        int result = 0;

        for (int i = 0; i < ctParams.size(); i++) {
            List<Map<String, Object>> aplyParam = new ArrayList<>();
            List<Map<String, Object>> atrzParam = new ArrayList<>();

            // 필수 컬럼 (참석자, atrz)
            String prjctId = String.valueOf(ctParams.get(i).get("prjctId"));
            String empId = String.valueOf(ctParams.get(i).get("empId"));
            String aplyYm = String.valueOf(ctParams.get(i).get("aplyYm"));
            String aplyOdr = String.valueOf(ctParams.get(i).get("aplyOdr"));
            String aprvrEmpId = String.valueOf(ctParams.get(i).get("aprvrEmpId"));

            // 참석자가 있을 경우 직원명 데이터 재조합 후 sn과 함께 insert
            Object atdrnObj = ctParams.get(i).get("atdrn");
            Object ctPrpos = ctParams.get(i).get("ctPrpos");

            if (ctPrpos == null || ctPrpos.toString().trim().isEmpty()) {
                ctParams.get(i).put("ctPrpos", null);
            }

            // atdrn이 리스트인지 문자열인지 확인하여 처리
            if (atdrnObj instanceof List) {
                List<Map<String, Object>> atdrn = (List<Map<String, Object>>) atdrnObj;
                if (atdrn != null && !atdrn.isEmpty()) {
                    String atdrnStr = atdrn.stream()
                            .map(map -> map.get("value").toString())
                            .collect(Collectors.joining(","));
                    ctParams.get(i).put("atdrn", atdrnStr);
                }
            } else if (atdrnObj == null || atdrnObj.toString().trim().isEmpty()) {
                ctParams.get(i).put("atdrn", null);
            }

            // aply insert
            aplyParam.add(Map.of("tbNm", "PRJCT_CT_APLY", "snColumn", "PRJCT_CT_APLY_SN", "snSearch", basicParam.get(i)));
            aplyParam.add(ctParams.get(i));
            result += commonService.insertData(aplyParam);

            List<Map<String, Object>> maxParam = new ArrayList<>();
            maxParam.add(Map.of("tbNm", "PRJCT_CT_APLY", "snColumn", "PRJCT_CT_APLY_SN"));
            maxParam.add(Map.of("prjctId", prjctId, "empId", empId, "aplyYm", aplyYm, "aplyOdr", aplyOdr));
            int maxSn = commonService.commonGetMax(maxParam);

            if (atdrnObj instanceof List) {
                List<Map<String, Object>> atdrn = (List<Map<String, Object>>) atdrnObj;
                if (atdrn != null && !atdrn.isEmpty()) {
                    for (Map<String, Object> onePerson : atdrn) {

                        List<Map<String, Object>> atdrnParam = new ArrayList<>();
                        Map<String, Object> atdrnTabMap = new HashMap<>();
                        Map<String, Object> atdrnMap = new HashMap<>();

                        atdrnTabMap.put("tbNm", "PRJCT_CT_ATDRN");
                        atdrnTabMap.put("snColumn", "PRJCT_CT_ATDRN_SN");

                        atdrnMap.put("prjctCtAplySn", maxSn);
                        atdrnMap.put("atndEmpId", onePerson.get("key"));
                        atdrnMap.put("atndEmpFlnm", onePerson.get("value"));
                        atdrnMap.put("prjctId", prjctId);
                        atdrnMap.put("empId", empId);
                        atdrnMap.put("aplyYm", aplyYm);
                        atdrnMap.put("aplyOdr", aplyOdr);

                        atdrnParam.add(atdrnTabMap);
                        atdrnParam.add(atdrnMap);

                        result += commonService.insertData(atdrnParam);
                    }
                }
            }
            // atrz insert
            atrzParam.add(Map.of("tbNm", "PRJCT_CT_ATRZ"));
            atrzParam.add(Map.of("prjctCtAplySn", maxSn, "prjctId", prjctId, "empId", empId, "aplyYm", aplyYm, "aplyOdr", aplyOdr, "aprvrEmpId", aprvrEmpId));
            result += commonService.insertData(atrzParam);
        }
        return result;
    }

    // 문화체련비 등록 시 청구금액 가산
    @Transactional
    public static int plusClturPhstrnActCt(Map<String, Object> param) {

        // 합계컬럼 없으면 추가
        Map<String, Object> paramClPh = new HashMap<>();
        paramClPh.put("queryId", "indvdlClmMapper.insertClPh");
        paramClPh.put("empId", param.get("empId"));
        paramClPh.put("state", "INSERT");
        paramClPh.put("clturPhstrnActMngYm", param.get("clmYmd").toString().substring(0, 6));
        YearMonth yearMonth = YearMonth.parse((String) paramClPh.get("clturPhstrnActMngYm"), DateTimeFormatter.ofPattern("yyyyMM"));
        LocalDate lastMonth = yearMonth.atDay(1).minusMonths(1);
        paramClPh.put("lastMonth", lastMonth.format(DateTimeFormatter.ofPattern("yyyyMM")));
        commonService.queryIdDataControl(paramClPh);
        paramClPh.put("lastMonth", param.get("clmYmd").toString().substring(0, 6));
        LocalDate nextMonth = yearMonth.atDay(1).plusMonths(1);
        paramClPh.put("clturPhstrnActMngYm", nextMonth.format(DateTimeFormatter.ofPattern("yyyyMM")));
        commonService.queryIdDataControl(paramClPh);

        // 합계컬럼 서치
        Map<String, Object> tbNm = new HashMap<>();
        tbNm.put("tbNm", "CLTUR_PHSTRN_ACT_CT");
        Map<String, Object> data = new HashMap<>();
        data.put("empId", param.get("empId"));
        data.put("clturPhstrnActMngYm", param.get("clmYmd").toString().substring(0, 6));
        List<Map<String, Object>> searchParam = new ArrayList<>();
        searchParam.add(tbNm);
        searchParam.add(data);
        List<Map<String, Object>> search = commonService.commonSelect(searchParam);
        Map<String, Object> shResult = search.get(0);

        // 합계컬럼 업데이트: 청구금액
        List<Map<String, Object>> updateParam = new ArrayList<>();
        Map<String, Object> updateData = new HashMap<>();
        if (param.get("clturPhstrnSeCd").equals("VTW00901")) {
            updateData.put("clturCtClmAmt", (int) shResult.get("clturCtClmAmt") + (int) param.get("clmAmt"));
        } else if (param.get("clturPhstrnSeCd").equals("VTW00902")) {
            updateData.put("ftnessTrngCtClmAmt", (int) shResult.get("ftnessTrngCtClmAmt") + (int) param.get("clmAmt"));
        }
        updateData.put("clmAmt", (int) shResult.get("clmAmt") + (int) param.get("clmAmt"));

        updateParam.add(tbNm);
        updateParam.add(updateData);
        updateParam.add(data);
        commonService.updateData(updateParam);

        // 다음달 합계컬럼 서치
        data.put("clturPhstrnActMngYm", paramClPh.get("clturPhstrnActMngYm"));
        searchParam.add(data);
        List<Map<String, Object>> searchNext = commonService.commonSelect(searchParam);
        Map<String, Object> shNxtResult = searchNext.get(0);

        // 합계컬럼 업데이트: 이월금액
        List<Map<String, Object>> nextParam = new ArrayList<>();
        Map<String, Object> nextData = new HashMap<>();
        if (param.get("clturPhstrnSeCd").equals("VTW00901")) {
            nextData.put("clturCtCyfdAmt", (int) shNxtResult.get("clturCtCyfdAmt") + (int) param.get("clmAmt"));
        } else if (param.get("clturPhstrnSeCd").equals("VTW00902")) {
            nextData.put("ftnessTrngCtCyfdAmt", (int) shNxtResult.get("ftnessTrngCtCyfdAmt") + (int) param.get("clmAmt"));
        }
        nextData.put("cyfdAmt", (int) shNxtResult.get("cyfdAmt") + (int) param.get("clmAmt"));

        nextParam.add(tbNm);
        nextParam.add(nextData);
        nextParam.add(data);
        int result = commonService.updateData(nextParam);

        return result;
    }

    // 문화체련비 삭제 시 청구금액 감산
    @Transactional
    public static int minusClturPhstrnActCt(Map<String, Object> param) {

        // 합계컬럼 서치
        Map<String, Object> tbNm = new HashMap<>();
        tbNm.put("tbNm", "CLTUR_PHSTRN_ACT_CT");
        Map<String, Object> data = new HashMap<>();
        data.put("empId", param.get("empId"));
        data.put("clturPhstrnActMngYm", param.get("clmYmd").toString().substring(0, 6));
        List<Map<String, Object>> searchParam = new ArrayList<>();
        searchParam.add(tbNm);
        searchParam.add(data);
        List<Map<String, Object>> search = commonService.commonSelect(searchParam);
        Map<String, Object> shResult = search.get(0);

        // 합계컬럼 업데이트: 청구금액
        Map<String, Object> updateData = new HashMap<>();
        if (param.get("clturPhstrnSeCd").equals("VTW00901")) {
            updateData.put("clturCtClmAmt", (int) shResult.get("clturCtClmAmt") - (int) param.get("clmAmt"));
        } else if (param.get("clturPhstrnSeCd").equals("VTW00902")) {
            updateData.put("ftnessTrngCtClmAmt", (int) shResult.get("ftnessTrngCtClmAmt") - (int) param.get("clmAmt"));
        }
        updateData.put("clmAmt", (int) shResult.get("clmAmt") - (int) param.get("clmAmt"));

        List<Map<String, Object>> updateParam = new ArrayList<>();
        updateParam.add(tbNm);
        updateParam.add(updateData);
        updateParam.add(data);
        commonService.updateData(updateParam);

        // 다음달 합계컬럼 서치
        YearMonth yearMonth = YearMonth.parse((String) data.get("clturPhstrnActMngYm"), DateTimeFormatter.ofPattern("yyyyMM"));
        LocalDate nextMonth = yearMonth.atDay(1).plusMonths(1);
        data.put("clturPhstrnActMngYm", nextMonth.format(DateTimeFormatter.ofPattern("yyyyMM")));
        searchParam.add(data);
        List<Map<String, Object>> searchNext = commonService.commonSelect(searchParam);
        Map<String, Object> shNxtResult = searchNext.get(0);

        // 합계컬럼 업데이트: 이월금액
        List<Map<String, Object>> nextParam = new ArrayList<>();
        Map<String, Object> nextData = new HashMap<>();
        if (param.get("clturPhstrnSeCd").equals("VTW00901")) {
            nextData.put("clturCtCyfdAmt", (int) shNxtResult.get("clturCtCyfdAmt") - (int) param.get("clmAmt"));
        } else if (param.get("clturPhstrnSeCd").equals("VTW00902")) {
            nextData.put("ftnessTrngCtCyfdAmt", (int) shNxtResult.get("ftnessTrngCtCyfdAmt") - (int) param.get("clmAmt"));
        }
        nextData.put("cyfdAmt", (int) shNxtResult.get("cyfdAmt") - (int) param.get("clmAmt"));

        nextParam.add(tbNm);
        nextParam.add(nextData);
        nextParam.add(data);
        int result = commonService.updateData(nextParam);

        return result;
    }

    // 문화체련비 변경 시 청구금액 재계산
    @Transactional
    public static int editClturPhstrnActCt(Map<String, Object> param) {

        // 합계컬럼 서치
        Map<String, Object> tbNm = new HashMap<>();
        tbNm.put("tbNm", "CLTUR_PHSTRN_ACT_CT");
        Map<String, Object> data = new HashMap<>();
        data.put("empId", param.get("empId"));
        data.put("clturPhstrnActMngYm", param.get("clmYmd").toString().substring(0, 6));
        List<Map<String, Object>> searchParam = new ArrayList<>();
        searchParam.add(tbNm);
        searchParam.add(data);
        List<Map<String, Object>> search = commonService.commonSelect(searchParam);
        Map<String, Object> shResult = search.get(0);

        // 합계컬럼 업데이트: 청구금액
        Map<String, Object> updateData = new HashMap<>();
        if (param.get("clturPhstrnSeCd").equals("VTW00901") && param.get("clturPhstrnSeCd").equals(param.get("selectedClturPhstrnSeCd"))) {
            updateData.put("clturCtClmAmt", (int) shResult.get("clturCtClmAmt") - (int) param.get("selectedClmAmt") + (int) param.get("clmAmt"));
        } else if (param.get("clturPhstrnSeCd").equals("VTW00902") && param.get("clturPhstrnSeCd").equals(param.get("selectedClturPhstrnSeCd"))) {
            updateData.put("ftnessTrngCtClmAmt", (int) shResult.get("ftnessTrngCtClmAmt") - (int) param.get("selectedClmAmt") + (int) param.get("clmAmt"));
        } else if (param.get("selectedClturPhstrnSeCd").equals("VTW00901") && param.get("clturPhstrnSeCd").equals("VTW00902")) {
            updateData.put("clturCtClmAmt", (int) shResult.get("clturCtClmAmt") - (int) param.get("selectedClmAmt"));
            updateData.put("ftnessTrngCtClmAmt", (int) shResult.get("ftnessTrngCtClmAmt") + (int) param.get("clmAmt"));
        } else if (param.get("selectedClturPhstrnSeCd").equals("VTW00902") && param.get("clturPhstrnSeCd").equals("VTW00901")) {
            updateData.put("ftnessTrngCtClmAmt", (int) shResult.get("ftnessTrngCtClmAmt") - (int) param.get("selectedClmAmt"));
            updateData.put("clturCtClmAmt", (int) shResult.get("clturCtClmAmt") + (int) param.get("clmAmt"));
        }
        updateData.put("clmAmt", (int) shResult.get("clmAmt") - (int) param.get("selectedClmAmt") + (int) param.get("clmAmt"));

        List<Map<String, Object>> updateParam = new ArrayList<>();
        updateParam.add(tbNm);
        updateParam.add(updateData);
        updateParam.add(data);
        commonService.updateData(updateParam);

        // 다음달 합계컬럼 서치
        YearMonth yearMonth = YearMonth.parse((String) data.get("clturPhstrnActMngYm"), DateTimeFormatter.ofPattern("yyyyMM"));
        LocalDate nextMonth = yearMonth.atDay(1).plusMonths(1);
        data.put("clturPhstrnActMngYm", nextMonth.format(DateTimeFormatter.ofPattern("yyyyMM")));
        searchParam.add(data);
        List<Map<String, Object>> searchNext = commonService.commonSelect(searchParam);
        Map<String, Object> shNxtResult = searchNext.get(0);

        // 합계컬럼 업데이트: 이월금액
        List<Map<String, Object>> nextParam = new ArrayList<>();
        Map<String, Object> nextData = new HashMap<>();
        if (param.get("clturPhstrnSeCd").equals("VTW00901") && param.get("clturPhstrnSeCd").equals(param.get("selectedClturPhstrnSeCd"))) {
            nextData.put("clturCtCyfdAmt", (int) shNxtResult.get("clturCtCyfdAmt") - (int) param.get("selectedClmAmt") + (int) param.get("clmAmt"));
        } else if (param.get("clturPhstrnSeCd").equals("VTW00902") && param.get("clturPhstrnSeCd").equals(param.get("selectedClturPhstrnSeCd"))) {
            nextData.put("ftnessTrngCtCyfdAmt", (int) shNxtResult.get("ftnessTrngCtCyfdAmt") - (int) param.get("selectedClmAmt") + (int) param.get("clmAmt"));
        } else if (param.get("selectedClturPhstrnSeCd").equals("VTW00901") && param.get("clturPhstrnSeCd").equals("VTW00902")) {
            nextData.put("clturCtCyfdAmt", (int) shNxtResult.get("clturCtCyfdAmt") - (int) param.get("selectedClmAmt"));
            nextData.put("ftnessTrngCtCyfdAmt", (int) shNxtResult.get("ftnessTrngCtCyfdAmt") + (int) param.get("clmAmt"));
        } else if (param.get("selectedClturPhstrnSeCd").equals("VTW00902") && param.get("clturPhstrnSeCd").equals("VTW00901")) {
            nextData.put("ftnessTrngCtCyfdAmt", (int) shNxtResult.get("ftnessTrngCtCyfdAmt") - (int) param.get("selectedClmAmt"));
            nextData.put("clturCtCyfdAmt", (int) shNxtResult.get("clturCtCyfdAmt") + (int) param.get("clmAmt"));
        }
        nextData.put("cyfdAmt", (int) shNxtResult.get("cyfdAmt") - (int) param.get("selectedClmAmt") + (int) param.get("clmAmt"));

        nextParam.add(tbNm);
        nextParam.add(nextData);
        nextParam.add(data);
        int result = commonService.updateData(nextParam);

        return result;
    }


    /* =================================박지환_작업================================= */
    // 프로젝트근무시간임시저장
    @Transactional
    public static String insertPrjctMmAplyTemp(List<Map<String, Object>> insertPrjctMmTempListValue) {
        // PRJCT_INDVDL_CT_MM(프로젝트개인비용MM) INSERT/UPDATE
        for (Map<String, Object> insertPrjctMmTempMap : insertPrjctMmTempListValue) {
            Map<String, Object> mergePrjctIndvdlCtMmMap = new HashMap<>();
            mergePrjctIndvdlCtMmMap = insertPrjctMmTempMap;
            mergePrjctIndvdlCtMmMap.put("queryId", "indvdlClmMapper.mergePrjctIndvdlCtMmStrg");
            mergePrjctIndvdlCtMmMap.put("state", "INSERT");
            commonService.queryIdDataControl(mergePrjctIndvdlCtMmMap);
        }

        for (Map<String, Object> insertPrjctMmTempMap : insertPrjctMmTempListValue) {
            Map<String, Object> insertPrjctMmAplyMap = new HashMap<>();
            insertPrjctMmAplyMap = insertPrjctMmTempMap;
            insertPrjctMmAplyMap.put("queryId", "indvdlClmMapper.insertPrjctMmAplyStrg");
            insertPrjctMmAplyMap.put("state", "INSERT");
            commonService.queryIdDataControl(insertPrjctMmAplyMap);

            Map<String, Object> insertPrjctMmAtrzMap = new HashMap<>();
            insertPrjctMmAtrzMap = insertPrjctMmTempMap;
            insertPrjctMmAtrzMap.put("queryId", "indvdlClmMapper.insertPrjctMmAtrzStrg");
            insertPrjctMmAtrzMap.put("state", "INSERT");
            commonService.queryIdDataControl(insertPrjctMmAtrzMap);
        }

        return null;
    }

    // 프로젝트근무시간삭제
    @Transactional
    public static List<Map<String, Object>> deletePrjctMmAply(List<Map<String, Object>> deletePrjctMmListValue, Map<String, Object> updatePrjctMmListValue) {
        for (Map<String, Object> deletePrjctMmAtrzParam : deletePrjctMmListValue) {
            Map<String, Object> deletePrjctMmAtrzMap = new HashMap<>();
            deletePrjctMmAtrzMap = deletePrjctMmAtrzParam;
            deletePrjctMmAtrzMap.put("queryId", "indvdlClmMapper.deletePrjctMmAtrz");
            deletePrjctMmAtrzMap.put("state", "DELETE");
            commonService.queryIdDataControl(deletePrjctMmAtrzMap);

        }

        for (Map<String, Object> deletePrjctMmAtrzParam : deletePrjctMmListValue) {
            Map<String, Object> deletePrjctMmAplyMap = new HashMap<>();
            deletePrjctMmAplyMap = deletePrjctMmAtrzParam;
            deletePrjctMmAplyMap.put("queryId", "indvdlClmMapper.deletePrjctMmAply");
            deletePrjctMmAplyMap.put("state", "DELETE");
            commonService.queryIdDataControl(deletePrjctMmAplyMap);
        }

        Map<String, Object> selectPrjctMmAply = new HashMap<>();
        selectPrjctMmAply.put("queryId", "indvdlClmMapper.selectPrjctMmAplyRowCnt");
        selectPrjctMmAply.put("empId", updatePrjctMmListValue.get("empId"));
        selectPrjctMmAply.put("aplyOdr", updatePrjctMmListValue.get("flagOrder"));
        selectPrjctMmAply.put("aplyYm", updatePrjctMmListValue.get("orderWorkBgngMm"));

        Map<String, Object> selectPrjctIndvdlCtMm = new HashMap<>();
        selectPrjctIndvdlCtMm.put("queryId", "indvdlClmMapper.selectPrjctIndvdlCtMmRowCnt");
        selectPrjctIndvdlCtMm.put("empId", updatePrjctMmListValue.get("empId"));
        selectPrjctIndvdlCtMm.put("aplyOdr", updatePrjctMmListValue.get("flagOrder"));
        selectPrjctIndvdlCtMm.put("aplyYm", updatePrjctMmListValue.get("orderWorkBgngMm"));

        List<Map<String, Object>> selectPrjctMmAplyResult = commonService.queryIdSearch(selectPrjctMmAply);
        List<Map<String, Object>> selectPrjctIndvdlCtMmResult = commonService.queryIdSearch(selectPrjctIndvdlCtMm);

        Map<String, Object> updatePrjctIndvdlCtMm = new HashMap<>();
        updatePrjctIndvdlCtMm.put("empId", updatePrjctMmListValue.get("empId"));
        updatePrjctIndvdlCtMm.put("aplyOdr", updatePrjctMmListValue.get("flagOrder"));
        updatePrjctIndvdlCtMm.put("aplyYm", updatePrjctMmListValue.get("orderWorkBgngMm"));

        if ((Integer.parseInt(String.valueOf(selectPrjctMmAplyResult.get(0).get("rowCount"))) == 0) && selectPrjctIndvdlCtMmResult.get(0).get("ctAtrzCmptnYn") == null){
            updatePrjctIndvdlCtMm.put("queryId", "indvdlClmMapper.updatePrjctIndvdlCtMmRowCnt");
            commonService.queryIdSearch(updatePrjctIndvdlCtMm);
        } else if ((Integer.parseInt(String.valueOf(selectPrjctMmAplyResult.get(0).get("rowCount"))) == 0) && selectPrjctIndvdlCtMmResult.get(0).get("ctAtrzCmptnYn").equals("N")){
            updatePrjctIndvdlCtMm.put("queryId", "indvdlClmMapper.updatePrjctIndvdlCtMmRowCnt");
            commonService.queryIdSearch(updatePrjctIndvdlCtMm);
        }

        return null;
    }


    // 프로젝트근무시간승인요청
    @Transactional
    public static List<Map<String, Object>> insertPrjctMmAply (List<Map<String, Object>> insertWorkHourListValue) {
        for (Map<String, Object> updateWorkHourMap : insertWorkHourListValue) {
            updateWorkHourMap.put("queryId", "indvdlClmMapper.retrievePrjctMmSttsInq");
            updateWorkHourMap.put("atrzDmndSttsCd", "VTW03702");
            updateWorkHourMap.put("state", "UPDATE");
            commonService.queryIdDataControl(updateWorkHourMap);
        }

        return null;
    }

    // 프로젝트근무시간요청취소
    public static List<Map<String, Object>> updatePrjctMmAply(List<Map<String, Object>> params) {
        int result;

        for (Map<String, Object> updateWorkHourMap : params) {
            Map<String, Object> updatePrjctMmAtrzMap = new HashMap<>();
            updatePrjctMmAtrzMap = updateWorkHourMap;
            updatePrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmSttsInq");
            updatePrjctMmAtrzMap.put("atrzDmndSttsCd", "VTW03701");
            List<Map<String, Object>> updatePrjctMmAtrzResult = commonService.queryIdSearch(updatePrjctMmAtrzMap);
        }

        return null;
    }

    // 휴가결재저장
    @Transactional
    public static String insertVcatnAtrz(
            Map<String, Object> elctrnAtrzId,           // 전자결재ID
            Map<String, Object> elctrnTbMap,            // ELCTRN_ATRZ
            Map<String, Object> insertElctrnMap,        // ELCTRN_ATRZ
            Map<String, Object> vcatnTbMap,             // VCATN_ATRZ
            Map<String, Object> insertVcatnMap,         // VCATN_ATRZ
            Map<String, Object> atrzLnTbMap,            // ATRZ_LN
            List<Map<String, Object>> insertAtrzLnMap,  // ATRZ_LN
            Map<String, Object> refrnTbMap,             // REFRN_MAN
            List<Map<String, Object>> insertRefrnMap,   // REFRN_MAN
            List<MultipartFile> attachments
    ) throws SQLException {
        String vcatnFlag = "";
        String errorMsg = "";
        int newVcatnUseDaycntValue = 0;

        // VCATN_MNG(휴가관리) 회계_신규 휴가일수 정합성 확인

        // 신규_회계년도 휴가정보 조회
        Map<String, Object> retrieveVcatnStrgInfoMap = new HashMap<>();
        retrieveVcatnStrgInfoMap = insertVcatnMap;
        retrieveVcatnStrgInfoMap.put("queryId", "indvdlClmMapper.retrieveVcatnStrgInfoInq");
        List<Map<String, Object>> retrieveVcatnStrgInfoResult = commonService.queryIdSearch(retrieveVcatnStrgInfoMap);

        // 휴가사용종류조회
        Map<String, Object> retrieveVcatnUseKndInqMap = new HashMap<>();
        retrieveVcatnUseKndInqMap = insertVcatnMap;
        retrieveVcatnUseKndInqMap.put("queryId", "indvdlClmMapper.retrieveVcatnUseKndInq");
        List<Map<String, Object>> retrieveVcatnUseKndInqResult = commonService.queryIdSearch(retrieveVcatnUseKndInqMap);

        // 프로젝트MM조회
        Map<String, Object> retrieveVcatnPrjctMmYnInqMap = new HashMap<>();
        retrieveVcatnPrjctMmYnInqMap = insertVcatnMap;
        retrieveVcatnPrjctMmYnInqMap.put("queryId", "indvdlClmMapper.retrieveVcatnPrjctMmYnInq");
        List<Map<String, Object>> retrieveVcatnPrjctMmYnInqResult = commonService.queryIdSearch(retrieveVcatnPrjctMmYnInqMap);

        if (retrieveVcatnStrgInfoResult.size() == 2) {
            vcatnFlag = "composite";
        } else if (retrieveVcatnStrgInfoResult.get(0).toString().indexOf("NEW") > -1) {
            vcatnFlag = "new";
        } else if (retrieveVcatnStrgInfoResult.get(0).toString().indexOf("ACCOUNT") > -1) {
            vcatnFlag = "account";
        }

        int cnt = 0;
//        while (cnt < retrieveVcatnPrjctMmYnInqResult.size()) {
//            if (retrieveVcatnPrjctMmYnInqResult.get(cnt).get("atrzDmndSttsCd").equals("VTW03702")) {
//                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 결재중입니다.";
//                break;
//            } else if (retrieveVcatnPrjctMmYnInqResult.get(cnt).get("mmAtrzCmptnYn").equals("Y")) {
//                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 마감되었습니다.";
//                break;
//            }
//            cnt++;
//        }
        for(int i=0; i<retrieveVcatnPrjctMmYnInqResult.size() ; i++){
            if (retrieveVcatnPrjctMmYnInqResult.get(i).get("atrzDmndSttsCd").equals("VTW03702")) {
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(i).get("aplyYmd") + "일의 근무시간이 결재중입니다.";
                break;
            } else if (retrieveVcatnPrjctMmYnInqResult.get(i).get("atrzDmndSttsCd").equals("VTW03703") && retrieveVcatnPrjctMmYnInqResult.get(i).get("md").equals(1)) {
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(i).get("aplyYmd") + "일의 근무시간이 마감되었습니다.";
                break;
            }
        }

        if (vcatnFlag.equals("account")) {
            if(insertVcatnMap.get("vcatnTyCd").equals("VTW01201") || insertVcatnMap.get("vcatnTyCd").equals("VTW01202") || insertVcatnMap.get("vcatnTyCd").equals("VTW01203")){
                if (Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(0).get("vcatnRemndrDaycnt"))) - Double.parseDouble(String.valueOf(insertVcatnMap.get("vcatnDeCnt"))) < -15) {
                    errorMsg = "휴가잔여일수는 -15일을 넘을 수 없습니다.";
                }
            }
        } else if (vcatnFlag.equals("composite")) {
            Map<String, Object> refNewVcatnMngMap = new HashMap<>();                // 신규휴가정보
            Map<String, Object> refVcatnMngMap = new HashMap<>();                   // 회계휴가정보

            List<Map<String, Object>> insertNewVcatnMngList = new ArrayList<>();    // 신규휴가입력정보
            List<Map<String, Object>> insertVcatnMngList = new ArrayList<>();       // 회계휴가입력정보

            Map<String, Object> insertTotalVcatnMngMap = new HashMap<>();           // 휴가입력정보

            // 신규_회계 잔여일수 정합성 확인
            for (int i = 0; i < retrieveVcatnStrgInfoResult.size(); i++) {
                if (retrieveVcatnStrgInfoResult.get(i).toString().indexOf("NEW") > -1) {
                    refNewVcatnMngMap.putAll(retrieveVcatnStrgInfoResult.get(i));
                } else if (retrieveVcatnStrgInfoResult.get(i).toString().indexOf("ACCOUNT") > -1) {
                    refVcatnMngMap.putAll(retrieveVcatnStrgInfoResult.get(i));
                }
            }

            // 신규_회계휴가 사용가능일수 정합성 확인
            for (int i = 0; i < retrieveVcatnUseKndInqResult.size(); i++) {
                if (retrieveVcatnUseKndInqResult.get(i).toString().indexOf("NEW") > -1) {
                    insertNewVcatnMngList.add(retrieveVcatnUseKndInqResult.get(i));
                } else if (retrieveVcatnUseKndInqResult.get(i).toString().indexOf("ACCOUNT") > -1) {
                    insertVcatnMngList.add(retrieveVcatnUseKndInqResult.get(i));
                }
            }

            double newRemndrDaycnt = Double.parseDouble(String.valueOf(refNewVcatnMngMap.get("newRemndrDaycnt")));
            double accountRemndrDaycnt = Double.parseDouble(String.valueOf(refVcatnMngMap.get("vcatnRemndrDaycnt")));

            // case_A
            // 신규배정휴가가 존재하고 잔여휴가일수에서 휴가신청이 가능한 경우
            if (insertNewVcatnMngList.size() > 0 && newRemndrDaycnt >= insertNewVcatnMngList.size()) {
                newVcatnUseDaycntValue = insertNewVcatnMngList.size();
                insertTotalVcatnMngMap.put("newVcatnUseDaycnt", insertNewVcatnMngList.size());
            }
            // case_B
            // 신규배정휴가가 존재하지만 잔여휴가일수에서 휴가신청이 불가능한 경우
            if (insertNewVcatnMngList.size() > 0 && newRemndrDaycnt < insertNewVcatnMngList.size()) {
                int valiFalg = 0; // 회계년도휴가 사용휴가일수
                for (int i = (int) (insertNewVcatnMngList.size() - newRemndrDaycnt); i < insertNewVcatnMngList.size(); i++) {
                    int whileCnt = 0;
                    while (whileCnt < insertVcatnMngList.size()) {
                        if (insertNewVcatnMngList.get(i).get("flagDate").toString().indexOf(insertVcatnMngList.get(cnt).get("flagDate").toString()) > -1) {
                            valiFalg++;
                        }
                        whileCnt++;
                    }
                }
                // case_B1
                // 회계년도휴가 사용일자에 사용가능한 경우
                if (valiFalg == insertNewVcatnMngList.size() - newRemndrDaycnt) {
                    // case_B1_1
                    // 회계년도휴가 사용일수가 -15일이 넘지않는 경우
                    if (accountRemndrDaycnt - valiFalg >= -15) {
                        newVcatnUseDaycntValue = (int) newRemndrDaycnt;
                        insertTotalVcatnMngMap.put("newVcatnUseDaycnt", newRemndrDaycnt);
                    }
                    // case_B1_2
                    // 회계년도휴가 사용일수가 -15일이 넘는 경우
                    else if (accountRemndrDaycnt - valiFalg < -15) {
                        errorMsg = "휴가잔여일수는 -15일을 넘을 수 없습니다.";
                    }
                }
                // case_B2
                // 회계년도휴가에서 사용불가능한 경우
                else {
                    errorMsg = "잔여휴가일수가 부족합니다.";
                }
            }
        }

        if (errorMsg.equals("")) {
            int queryResult = 0;
            final String sortKey = "approvalCode";

            String elctrnAtrzValue = (String) elctrnAtrzId.get("elctrnAtrzId");

            Collections.sort(insertAtrzLnMap, new Comparator<Map<String, Object>>() {
                @Override
                public int compare(Map<String, Object> map1, Map<String, Object> map2) {
                    Comparable value1 = (Comparable) map1.get(sortKey);
                    Comparable value2 = (Comparable) map2.get(sortKey);
                    return value1.compareTo(value2);
                }
            });

            // ELCTRN_ATRZ(전자결재) 테이블 저장
            List<Map<String, Object>> insertElctrnList = new ArrayList<>();

            Map<String, Object> selectElctrnAtrz = new HashMap<>();
            selectElctrnAtrz.put("queryId", "indvdlClmMapper.retrieveElctrnAtrzCnt");

            List<Map<String, Object>> selectElctrnAtrzResult = commonService.queryIdSearch(selectElctrnAtrz);

            String refSolYear = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));

            insertElctrnMap.put("elctrnAtrzId", elctrnAtrzValue);
            insertElctrnMap.put("atrzFormDocId", "2d90b8ef-132a-11ef-bf20-02a5fafa82da");
            insertElctrnMap.put("nowAtrzLnSn", "1");
            insertElctrnMap.put("elctrnAtrzDocNo", refSolYear + "-01-" + (Integer.parseInt(String.valueOf(selectElctrnAtrzResult.get(0).get("rowCnt"))) + 1));
            insertElctrnMap.put("atrzHistSeCd", "VTW05401");
            insertElctrnList.add(0, elctrnTbMap);
            insertElctrnList.add(1, insertElctrnMap);
            queryResult = commonService.insertData(insertElctrnList);

            // VCATN_ATRZ(휴가결재), ATCHMNFL(첨부파일) 테이블 저장
            insertVcatnMap.put("elctrnAtrzId", elctrnAtrzValue);
            insertVcatnMap.put("newVcatnUseDaycnt", newVcatnUseDaycntValue);
            queryResult = commonService.insertFile(vcatnTbMap, insertVcatnMap, attachments, null, null);

            // ATRZ_LN(결재선) 저장
            List<Map<String, Object>> insertAtrzLnList = new ArrayList<>();
            insertAtrzLnList.add(0, atrzLnTbMap);
            for (int i = 0; i < insertAtrzLnMap.size(); i++) {
                insertAtrzLnMap.get(i).put("elctrnAtrzId", elctrnAtrzValue);
                insertAtrzLnMap.get(i).put("atrzStepCd", insertAtrzLnMap.get(i).get("approvalCode"));
                insertAtrzLnMap.get(i).put("aprvrEmpId", insertAtrzLnMap.get(i).get("empId"));
                if (i == 0) insertAtrzLnMap.get(i).put("atrzSttsCD", "VTW00801");
                else insertAtrzLnMap.get(i).put("atrzSttsCD", "VTW00806");
                insertAtrzLnMap.get(i).put("atrzLnSn", i + 1);
                insertAtrzLnList.add(i + 1, insertAtrzLnMap.get(i));
            }
            queryResult = commonService.insertData(insertAtrzLnList);

            // REFRN_MAN(결재선) 저장
            List<Map<String, Object>> insertRefrnManList = new ArrayList<>();
            insertRefrnManList.add(0, refrnTbMap);
            for (int i = 0; i < insertRefrnMap.size(); i++) {
                insertRefrnMap.get(i).put("elctrnAtrzId", elctrnAtrzValue);
                insertRefrnMap.get(i).put("refrnCncrrncClCd", insertRefrnMap.get(i).get("approvalCode"));
                insertRefrnMap.get(i).put("ccSn", i + 1);
                insertRefrnManList.add(i + 1, insertRefrnMap.get(i));
            }
            queryResult = commonService.insertData(insertRefrnManList);

            emailSendService.elecAtrzEmailSend(
                    String.valueOf(insertAtrzLnMap.get(0).get("empId"))
                    ,String.valueOf(insertElctrnMap.get("atrzDmndEmpId"))
                    ,"1"
                    ,"[" + insertVcatnMap.get("vcatnBgngYmd") + "~" + insertVcatnMap.get("vcatnEndYmd") + "] 휴가결재 결재 요청 완료."
                    ,"[" + insertVcatnMap.get("vcatnBgngYmd") + "~" + insertVcatnMap.get("vcatnEndYmd") + "] 휴가결재에 대한 결재가 요청되었습니다."
                    ,false
                    ,""
            );

            return "성공";
        } else {
            return errorMsg;
        }
    }

    // 휴가신청승인
    public static List<Map<String, Object>> updateVcatnMng(Map<String, Object> params) throws SQLException {
        int queryResult;
        int caseFlag = 0;

        String elctrnAtrzId = (String) params.get("elctrnAtrzId");
        String empId = (String) params.get("empId");
        String vcatnTyCd = (String) params.get("vcatnTyCd");
        String vcatnBgngYmd = (String) params.get("vcatnBgngYmd");
        String vcatnEndYmd = (String) params.get("vcatnEndYmd");
        String mdfcnEmpId = (String) params.get("mdfcnEmpId");
        String errorMsg = "";
        String atrzStepCd = (String) params.get("atrzStepCd");
        List<Map<String, Object>> succMsgList = new ArrayList<>();

        List<Map<String, Object>> aprvParamList = new ArrayList<>();
        aprvParamList = (List<Map<String, Object>>) params.get("aprvParam");

        List<Map<String, Object>> errorMsgList = new ArrayList<>();

        // 프로젝트MM조회
        Map<String, Object> retrieveVcatnPrjctMmYnInqMap = new HashMap<>();
        retrieveVcatnPrjctMmYnInqMap.put("queryId", "indvdlClmMapper.retrieveVcatnPrjctMmYnInq");
        retrieveVcatnPrjctMmYnInqMap.put("empId", empId);
        retrieveVcatnPrjctMmYnInqMap.put("vcatnBgngYmd", vcatnBgngYmd);
        retrieveVcatnPrjctMmYnInqMap.put("vcatnEndYmd", vcatnEndYmd);
        List<Map<String, Object>> retrieveVcatnPrjctMmYnInqResult = commonService.queryIdSearch(retrieveVcatnPrjctMmYnInqMap);

        // case_common
        // 결재중인 근무시간이 있거나 승인된 근무시간이 있는 경우
        int cnt = 0;
//        while (cnt < retrieveVcatnPrjctMmYnInqResult.size()) {
//            if (retrieveVcatnPrjctMmYnInqResult.get(cnt).get("atrzDmndSttsCd").equals("VTW03702")) {
//                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 결재중입니다.";
//                break;
//            } else if (retrieveVcatnPrjctMmYnInqResult.get(cnt).get("mmAtrzCmptnYn").equals("Y")) {
//                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 마감되었습니다.";
//                break;
//            }
//            cnt++;
//        }
        for(int i=0; i<retrieveVcatnPrjctMmYnInqResult.size() ; i++){
            if (retrieveVcatnPrjctMmYnInqResult.get(i).get("atrzDmndSttsCd").equals("VTW03702")) {
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(i).get("aplyYmd") + "일의 근무시간이 결재중입니다.";
                break;
            } else if (retrieveVcatnPrjctMmYnInqResult.get(i).get("atrzDmndSttsCd").equals("VTW03703") && retrieveVcatnPrjctMmYnInqResult.get(i).get("md").equals(1)) {
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(i).get("aplyYmd") + "일의 근무시간이 마감되었습니다.";
                break;
            }
        }

        List<Map<String, Object>> selectVcatnAtrz = new ArrayList<>();

        selectVcatnAtrz.add(0, new HashMap<>() {{ put("tbNm", "VCATN_ATRZ"); }});
        selectVcatnAtrz.add(1, new HashMap<>() {{ put("elctrnAtrzId", elctrnAtrzId); }});

        // 사용휴가정보조회
        List<Map<String, Object>> selectVcatnAtrzResult = commonService.commonSelect(selectVcatnAtrz);

        Map<String, Object> selectVcatnMng = new HashMap<>();

        selectVcatnMng.put("queryId", "indvdlClmMapper.retrieveVcatnStrgInfoInq");
        selectVcatnMng.put("empId", empId);
        selectVcatnMng.put("vcatnBgngYmd", selectVcatnAtrzResult.get(0).get("vcatnBgngYmd"));

        // 휴가정합성정보조회
        List<Map<String, Object>> selectVcatnMngResult = commonService.queryIdSearch(selectVcatnMng);

        // 신규_회계휴가 정보
        Map<String, Object> refNewVcatnMngMap = new HashMap<>();    // 신규휴가정보
        Map<String, Object> refVcatnMngMap = new HashMap<>();       // 회계휴가정보

        // 신규_회계 잔여일수 정합성 확인
        for (int i = 0; i < selectVcatnMngResult.size(); i++) {
            if (selectVcatnMngResult.get(i).toString().indexOf("NEW") > -1) {
                refNewVcatnMngMap.putAll(selectVcatnMngResult.get(i));
            } else if (selectVcatnMngResult.get(i).toString().indexOf("ACCOUNT") > -1) {
                refVcatnMngMap.putAll(selectVcatnMngResult.get(i));
            }
        }

        // 휴가신청사용일수
        Double vcatnDeCnt = Double.parseDouble(String.valueOf(selectVcatnAtrzResult.get(0).get("vcatnDeCnt")));
        Double newVcatnUseDaycnt = 0.0;
        if (newVcatnUseDaycnt != null) {
            newVcatnUseDaycnt = Double.parseDouble(String.valueOf(newVcatnUseDaycnt));
            // newVcatnDeCnt를 사용하는 코드 여기에 작성
        } else {
            // newVcatnUseDaycnt가 null일 경우의 처리 코드 여기에 작성
        }

        Double useVcatnDeCnt = 0.0;
        Double useNewVcatnUseDaycnt = 0.0;

        // 잔여휴가일수
        if (!refVcatnMngMap.isEmpty()) {
            useVcatnDeCnt = Double.parseDouble(String.valueOf(refVcatnMngMap.get("vcatnRemndrDaycnt")));
        }
        if (!refNewVcatnMngMap.isEmpty()) {
            useNewVcatnUseDaycnt = Double.parseDouble(String.valueOf(refNewVcatnMngMap.get("newRemndrDaycnt")));
        }

        // 휴가정합성 확인 후 회계휴가 updateMap
        Map<String, Object> updateVcatnMng = new HashMap<>();
        updateVcatnMng.put("queryId", "indvdlClmMapper.updateVcatnAltmntMngMdfcn");
        updateVcatnMng.put("vcatnYr", refVcatnMngMap.get("vcatnYr"));
        updateVcatnMng.put("empId", empId);
        updateVcatnMng.put("mdfcnEmpId", mdfcnEmpId);
        updateVcatnMng.put("state", "UPDATE");

        // 휴가정합성 확인 후 신규휴가 updateMap
        Map<String, Object> updateNewVcatnMng = new HashMap<>();
        updateNewVcatnMng.put("queryId", "indvdlClmMapper.retrieveNewVcatnAltmntMngMdfcn");
//        updateNewVcatnMng.put("vcatnYr", refNewVcatnMngMap.get("vcatnYr"));
        updateNewVcatnMng.put("newVcatnYr", "Y");
        updateNewVcatnMng.put("empId", empId);
        updateNewVcatnMng.put("mdfcnEmpId", mdfcnEmpId);
        updateNewVcatnMng.put("state", "UPDATE");

        // case_A
        // 신규휴가만사용
        if (Objects.equals(vcatnDeCnt, newVcatnUseDaycnt)) {
            caseFlag = 1;
            // case_1
            // 신규휴가사용가능할 경우
            if (useNewVcatnUseDaycnt >= newVcatnUseDaycnt) {
                updateNewVcatnMng.put("newDaycnt", newVcatnUseDaycnt);
            }
            // case_2
            // 신규휴가사용불가능할 경우
            else if (useNewVcatnUseDaycnt < newVcatnUseDaycnt) {
                errorMsg += "입사일기준 잔여휴가일수가 부족합니다.\n";
            }
        }

        // case_B
        // 회계휴가만사용
        if (newVcatnUseDaycnt == 0) {
            caseFlag = 2;
            // case_B1
            // 공가사용하는 경우
            if (vcatnTyCd.equals("VTW01204") || vcatnTyCd.equals("VTW01205") || vcatnTyCd.equals("VTW01207") || vcatnTyCd.equals("VTW01208")) {
                updateVcatnMng.put("newPblenVcatnUseDaycnt", vcatnDeCnt);
            }
            // case_B2
            // 회계휴가사용하는 경우
            else {
                // case_B2_1
                // 회계휴가사용가능한 경우
                if (useVcatnDeCnt - vcatnDeCnt >= -15) {
                    updateVcatnMng.put("newDaycnt", vcatnDeCnt);
                }

                // case_B2_1
                // 회계휴가잔여일수가 -15일이 넘는 경우
                else if (useVcatnDeCnt - vcatnDeCnt < -15) {
                    errorMsg += "휴가잔여일수는 -15일을 넘을 수 없습니다.\n";
                }
            }
        }

        // case_C
        // 신규휴가와 회계휴가 사용
        if (newVcatnUseDaycnt != 0 && !Objects.equals(vcatnDeCnt, newVcatnUseDaycnt)) {
            caseFlag = 3;
            // case_C1
            // 신규휴가사용불가능할 경우
            if (useNewVcatnUseDaycnt < newVcatnUseDaycnt) {
                errorMsg += "입사일기준 잔여휴가일수가 부족합니다.\n";
            }
            // case_C2
            // 회계휴가잔여일수가 -15일이 넘는 경우
            else if (useVcatnDeCnt - vcatnDeCnt - newVcatnUseDaycnt < -15) {
                errorMsg += "휴가잔여일수는 -15일을 넘을 수 없습니다.\n";
            }
            // case_C3
            // 사용가능한 경우
            else {
                updateVcatnMng.put("newDaycnt", vcatnDeCnt);
                updateNewVcatnMng.put("newDaycnt", newVcatnUseDaycnt);
            }
        }

        int atrzLnSn = 0;

        if (errorMsg.isEmpty()) {
            try {
                switch (caseFlag) {
                    case 1: {
                        // 승인처리
                        Map<String, Object> aprvResult = new HashMap<>();
                        aprvResult = ElecAtrzDomain.aprvElecAtrz(aprvParamList);

                        atrzLnSn = Integer.parseInt(String.valueOf(aprvResult.get("atrzLnSn")));
                        
                        if (String.valueOf(aprvResult.get("atrzStepCd")).equals("VTW00705")) {
                            commonService.queryIdDataControl(updateNewVcatnMng);
                        }

                        break;
                    }
                    case 2: {
                        // 승인처리
                        Map<String, Object> aprvResult = new HashMap<>();
                        aprvResult = ElecAtrzDomain.aprvElecAtrz(aprvParamList);

                        if (String.valueOf(aprvResult.get("atrzStepCd")).equals("VTW00705")) {
                            commonService.queryIdDataControl(updateVcatnMng);
                        }
                        atrzLnSn = Integer.parseInt(String.valueOf(aprvResult.get("atrzLnSn")));

                        break;
                    }
                    case 3: {
                        // 승인처리
                        Map<String, Object> aprvResult = new HashMap<>();
                        aprvResult = ElecAtrzDomain.aprvElecAtrz(aprvParamList);

                        if (String.valueOf(aprvResult.get("atrzStepCd")).equals("VTW00705")) {
                            commonService.queryIdDataControl(updateNewVcatnMng);
                            commonService.queryIdDataControl(updateVcatnMng);
                        }
                        atrzLnSn = Integer.parseInt(String.valueOf(aprvResult.get("atrzLnSn")));
                        break;
                    }
                }

                Map<String, Object> aprvResult = new HashMap<>();
                aprvResult.put("succMsg", "SUCCESS");
                aprvResult.put("atrzLnSn", atrzLnSn);
                succMsgList.add(0, aprvResult);

                return succMsgList;

            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            String finalErrorMsg = errorMsg;
            errorMsgList.add(0, new HashMap<>() {{
                put("errorMsg ", finalErrorMsg);
            }});

            return errorMsgList;
        }

        // 성공리턴추가
        return null;
    }

    // 휴가취소신청
    public static List<Map<String, Object>> reInsertVcatnAtrz(
            Map<String, Object> insertDataMapValue,
            Map<String, Object> insertElctrnAtrzMapValue,
            Map<String, Object> insertVactnAtrzMapValue,
            List<Map<String, Object>> insertAtrzLnListValue,
            List<Map<String, Object>> insertRefrnManListValue
    ) {
        String elctrnAtrzId = (String) insertDataMapValue.get("elctrnAtrzId");

        Map<String, Object> selectElctrnAtrz = new HashMap<>();
        selectElctrnAtrz.put("queryId", "indvdlClmMapper.retrieveElctrnAtrzCnt");

        List<Map<String, Object>> selectElctrnAtrzResult = commonService.queryIdSearch(selectElctrnAtrz);

        String refSolYear = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));

        // ELCTRN_ATRZ(전자결재저장)
        insertElctrnAtrzMapValue.put("elctrnAtrzId", insertDataMapValue.get("elctrnAtrzId"));
        insertElctrnAtrzMapValue.put("atrzDmndEmpId", insertDataMapValue.get("empId"));
        insertElctrnAtrzMapValue.put("atrzDmndSttsCd", "VTW03702");
        insertElctrnAtrzMapValue.put("nowAtrzLnSn", 1);
        insertElctrnAtrzMapValue.put("regEmpId", insertDataMapValue.get("empId"));
        insertElctrnAtrzMapValue.put("mdfcnEmpId", insertDataMapValue.get("empId"));
        insertElctrnAtrzMapValue.put("elctrnAtrzTySeCd", "VTW04915");
        insertElctrnAtrzMapValue.put("atrzFormDocId", "901c0b88-21b9-d716-b2c2-c1f7c2b10fc4");
        insertElctrnAtrzMapValue.put("elctrnAtrzDocNo", refSolYear + "-15-" + (Integer.parseInt(String.valueOf(selectElctrnAtrzResult.get(0).get("rowCnt"))) + 1));
        insertElctrnAtrzMapValue.put("histElctrnAtrzId", insertDataMapValue.get("histElctrnAtrzId"));
        insertElctrnAtrzMapValue.put("atrzHistSeCd", "VTW05405");

        // VCATN_ATRZ(휴가결재저장)
        insertVactnAtrzMapValue.put("elctrnAtrzId", insertDataMapValue.get("elctrnAtrzId"));
        insertVactnAtrzMapValue.put("rtrcnPrvonsh", insertDataMapValue.get("rtrcnPrvonsh"));
        insertVactnAtrzMapValue.put("vcatnTyCd", "VTW01206");

        // ATRZ_LN(결재선저장)
        for (int i = 0; i < insertAtrzLnListValue.size(); i++) {
            Map<String, Object> insertMap = new HashMap<>();
            insertMap = insertAtrzLnListValue.get(i);
            insertMap.put("elctrnAtrzId", elctrnAtrzId);
            insertMap.put("atrzSttsCd", "VTW00801");
            insertMap.put("aprvYmd", null);
            insertMap.put("atrzOpnnCn", null);
            insertAtrzLnListValue.set(i, insertMap);
        }

        // REFRN_MAN(참조자저장)
        // 휴가취소의 경우 합의에 이진원이사 고정
        Map<String, Object> insertRefrnManMap = new HashMap<>() {
            {
                put("elctrnAtrzId", elctrnAtrzId);
                put("ccSn", 1);
                put("empId", "284fc940-1a83-11ef-9781-02a5fafa82da");
                put("refrnCncrrncClCd", "VTW00707");
            }
        };

        List<Map<String, Object>> insertElctrnAtrzList = new ArrayList<>();
        insertElctrnAtrzList.add(0, new HashMap<>() {{ put("tbNm", "ELCTRN_ATRZ"); }});
        insertElctrnAtrzList.add(1, insertElctrnAtrzMapValue);


        List<Map<String, Object>> insertVactnAtrzList = new ArrayList<>();
        insertVactnAtrzList.add(0, new HashMap<>() {{ put("tbNm", "VCATN_ATRZ"); }});
        insertVactnAtrzList.add(1, insertVactnAtrzMapValue);


        List<Map<String, Object>> insertAtrzLnList = new ArrayList<>();
        insertAtrzLnList.add(0, new HashMap<>() {{ put("tbNm", "ATRZ_LN"); }});

        for (int i = 0; i < insertAtrzLnListValue.size(); i++) {
            insertAtrzLnList.add(i + 1, insertAtrzLnListValue.get(i));
        }


        List<Map<String, Object>> insertRefrnManList = new ArrayList<>();
        insertRefrnManList.add(0, new HashMap<>() {{ put("tbNm", "REFRN_MAN"); }});
        insertRefrnManList.add(1, insertRefrnManMap);

        commonService.insertData(insertElctrnAtrzList);
        commonService.insertData(insertVactnAtrzList);
        commonService.insertData(insertAtrzLnList);
        commonService.insertData(insertRefrnManList);

        emailSendService.elecAtrzEmailSend(
                String.valueOf(insertAtrzLnListValue.get(0).get("empId"))
                ,String.valueOf(insertDataMapValue.get("empId"))
                ,elctrnAtrzId
                ,"[" + insertVactnAtrzMapValue.get("vcatnBgngYmd") + "~" + insertVactnAtrzMapValue.get("vcatnEndYmd") + "] 휴가취소결재 결재 요청 완료."
                ,"[" + insertVactnAtrzMapValue.get("vcatnBgngYmd") + "~" + insertVactnAtrzMapValue.get("vcatnEndYmd") + "] 휴가취소결재에 대한 결재가 요청되었습니다."
                ,false
                ,""
        );

        return null;
    }

    // 휴가신청취소승인
    public static List<Map<String, Object>> approvalReInsertVcatnAtrz(Map<String, Object> params) throws ParseException {
        int queryResult = 0;
        int caseFlag = 0;
        String empId = (String) params.get("empId");
        String elctrnAtrzId = (String) params.get("elctrnAtrzId");
        String histElctrnAtrzId = (String) params.get("histElctrnAtrzId");
        String atrzStepCd = (String) params.get("atrzStepCd");
        String mdfcnEmpId = (String) params.get("mdfcnEmpId");

        // 결재 승인 paramList
        List<Map<String, Object>> aprvParamList = new ArrayList<>();
        aprvParamList = (List<Map<String, Object>>) params.get("aprvParam");

        List<Map<String, Object>> succMsgList = new ArrayList<>();

        // 휴가사용일수전자결재조회
        List<Map<String, Object>> selectElctrnAtrzList = new ArrayList<>();
        selectElctrnAtrzList.add(0, new HashMap<>() {{ put("tbNm", "VCATN_ATRZ"); }});
        selectElctrnAtrzList.add(1, new HashMap<>() {{ put("elctrnAtrzId", histElctrnAtrzId); }});

        List<Map<String, Object>> selectElctrnAtrzListResult = commonService.commonSelect(selectElctrnAtrzList);

        // 날짜비교 포맷팅
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
        Date vcatnBgngYmd = formatter.parse((String) selectElctrnAtrzListResult.get(0).get("vcatnBgngYmd"));
        Date flagYmd = formatter.parse(selectElctrnAtrzListResult.get(0).get("vcatnBgngYmd").toString().substring(0, 4) + "0401");

        // 휴가사용종류조회
        Map<String, Object> selectVcatnMng = new HashMap<>();
        selectVcatnMng.put("queryId", "indvdlClmMapper.retrieveVcatnStrgInfoInq");
        selectVcatnMng.put("vcatnBgngYmd", selectElctrnAtrzListResult.get(0).get("vcatnBgngYmd"));
        selectVcatnMng.put("empId", empId);

        List<Map<String, Object>> selectVcatnMngResult = commonService.queryIdSearch(selectVcatnMng);

        Map<String, Object> refNewVcatnMngMap = new HashMap<>();                // 신규휴가정보
        Map<String, Object> refVcatnMngMap = new HashMap<>();                    // 회계휴가정보

        for (int i = 0; i < selectVcatnMngResult.size(); i++) {
            if (selectVcatnMngResult.get(i).toString().indexOf("NEW") > -1) {
                refNewVcatnMngMap.putAll(selectVcatnMngResult.get(i));
            } else if (selectVcatnMngResult.get(i).toString().indexOf("ACCOUNT") > -1) {
                refVcatnMngMap.putAll(selectVcatnMngResult.get(i));
            }
        }

        String vcatnYr = "";

        if (vcatnBgngYmd.compareTo(flagYmd) >= 0) {
            vcatnYr = selectElctrnAtrzListResult.get(0).get("vcatnBgngYmd").toString().substring(0, 4);
        } else {
            vcatnYr = selectElctrnAtrzListResult.get(0).get("vcatnBgngYmd").toString().substring(0, 4);
        }

        // 회계휴가수정정보
        Map<String, Object> updateVcatnMngMap = new HashMap<>();
        updateVcatnMngMap.put("queryId", "indvdlClmMapper.updateVcatnAltmntMngCnclMdfcn");
        updateVcatnMngMap.put("empId", empId);
        updateVcatnMngMap.put("vcatnYr", vcatnYr);
        updateVcatnMngMap.put("mdfcnEmpId", mdfcnEmpId);
        updateVcatnMngMap.put("state", "UPDATE");


        // 신규휴가수정정보
        Map<String, Object> updateNewVcatnMngMap = new HashMap<>();
        updateNewVcatnMngMap.put("queryId", "indvdlClmMapper.updateNewVcatnAltmntMngCnclMdfcn");
        updateNewVcatnMngMap.put("empId", empId);
        updateNewVcatnMngMap.put("mdfcnEmpId", mdfcnEmpId);
        updateNewVcatnMngMap.put("state", "UPDATE");

        // case_A
        // 공가인경우
        if (selectElctrnAtrzListResult.get(0).get("vcatnTyCd").equals("VTW01204") || selectElctrnAtrzListResult.get(0).get("vcatnTyCd").equals("VTW01205") || selectElctrnAtrzListResult.get(0).get("vcatnTyCd").equals("VTW01207") || selectElctrnAtrzListResult.get(0).get("vcatnTyCd").equals("VTW01208")) {
            caseFlag = 1;
            updateVcatnMngMap.put("newPblenVcatnUseDaycnt", selectElctrnAtrzListResult.get(0).get("vcatnDeCnt"));
        }
        // case_B
        // 공가가아닌경우
        else {
            Double vcatnDeCnt = Double.parseDouble(String.valueOf(selectElctrnAtrzListResult.get(0).get("vcatnDeCnt")));
            Object newVcatnUseDaycnt = selectElctrnAtrzListResult.get(0).get("newVcatnUseDaycnt");
            Double newVcatnDeCnt = 0.0;
            if (newVcatnUseDaycnt != null) {
                newVcatnDeCnt = Double.parseDouble(String.valueOf(newVcatnUseDaycnt));
                // newVcatnDeCnt를 사용하는 코드 여기에 작성
            } else {
                // newVcatnUseDaycnt가 null일 경우의 처리 코드 여기에 작성
            }

            // case_B1
            // 신규휴가만 사용한 경우
            if (vcatnDeCnt.equals(newVcatnDeCnt)) {
                caseFlag = 2;
                updateNewVcatnMngMap.put("newVcatnYn", "Y");
                updateNewVcatnMngMap.put("newDaycnt", newVcatnDeCnt);
            }

            // case_B2
            // 회계휴가만 사용한 경우
            else if (newVcatnDeCnt.equals(Double.parseDouble(String.valueOf(0)))) {
                caseFlag = 3;
                updateVcatnMngMap.put("newDaycnt", vcatnDeCnt);
            }

            // case_B3
            // 신규휴가, 회계휴가 사용한 경우
            else {
                caseFlag = 4;
                updateVcatnMngMap.put("newDaycnt", vcatnDeCnt);
                updateNewVcatnMngMap.put("newDaycnt", newVcatnDeCnt);
            }
        }

        Map<String, Object> updateElctrnAtrz = new HashMap<>();
        updateElctrnAtrz.put("queryId", "indvdlClmMapper.updateElctrnAtrzCncl");
        updateElctrnAtrz.put("elctrnAtrzId", histElctrnAtrzId);

        int atrzLnSn = 0;
        try {
            switch (caseFlag) {
                case 1: {
                    // 승인처리
                    Map<String, Object> aprvResult = new HashMap<>();
                    aprvResult = ElecAtrzDomain.aprvElecAtrz(aprvParamList);

                    if (String.valueOf(aprvResult.get("atrzStepCd")).equals("VTW00705")) {

                        commonService.queryIdDataControl(updateVcatnMngMap);
                        commonService.queryIdSearch(updateElctrnAtrz);
                    }
                    atrzLnSn = Integer.parseInt(String.valueOf(aprvResult.get("atrzLnSn")));

                    break;
                }
                case 2: {
                    // 승인처리
                    Map<String, Object> aprvResult = new HashMap<>();
                    aprvResult = ElecAtrzDomain.aprvElecAtrz(aprvParamList);

                    if (String.valueOf(aprvResult.get("atrzStepCd")).equals("VTW00705")) {

                        commonService.queryIdDataControl(updateNewVcatnMngMap);
                        commonService.queryIdSearch(updateElctrnAtrz);
                    }
                    atrzLnSn = Integer.parseInt(String.valueOf(aprvResult.get("atrzLnSn")));

                    break;
                }
                case 3: {
                    // 승인처리
                    Map<String, Object> aprvResult = new HashMap<>();
                    aprvResult = ElecAtrzDomain.aprvElecAtrz(aprvParamList);

                    if (String.valueOf(aprvResult.get("atrzStepCd")).equals("VTW00705")) {

                        commonService.queryIdDataControl(updateVcatnMngMap);
                        commonService.queryIdSearch(updateElctrnAtrz);
                    }
                    atrzLnSn = Integer.parseInt(String.valueOf(aprvResult.get("atrzLnSn")));

                    break;
                }
                case 4: {
                    Map<String, Object> aprvResult = new HashMap<>();
                    aprvResult = ElecAtrzDomain.aprvElecAtrz(aprvParamList);

                    if (String.valueOf(aprvResult.get("atrzStepCd")).equals("VTW00705")) {
                        commonService.queryIdDataControl(updateVcatnMngMap);
                        commonService.queryIdDataControl(updateNewVcatnMngMap);
                        commonService.queryIdSearch(updateElctrnAtrz);
                    }
                    atrzLnSn = Integer.parseInt(String.valueOf(aprvResult.get("atrzLnSn")));

                    break;
                }
            }

            Map<String, Object> aprvResult = new HashMap<>();
            aprvResult.put("succMsg", "SUCCESS");
            aprvResult.put("atrzLnSn", atrzLnSn);
            succMsgList.add(0, aprvResult);

            return succMsgList;
        } catch (Exception e) {
            Map<String, Object> aprvResult = new HashMap<>();
            aprvResult.put("succMsg", "FAIL");
            aprvResult.put("atrzLnSn", atrzLnSn);
            succMsgList.add(0, aprvResult);

            return succMsgList;
        }
    }

    // 휴가신청취소
    public static int deleteVcatnAtrz(Map<String, Object> dataMap) {
        int queryResult = 0;
        Map<String, Object> elctrnAtrzIdMap = new HashMap<>() {{ put("elctrnAtrzId", dataMap.get("elctrnAtrzId")); }};

        List<Map<String, Object>> deleteElctrnAtrzList = new ArrayList<>();
        deleteElctrnAtrzList.add(0, new HashMap<>() {{ put("tbNm", "ELCTRN_ATRZ"); }});
        deleteElctrnAtrzList.add(1, elctrnAtrzIdMap);

        // 첨부파일이 존재하는지 확인 - 첨부파일 포함 전체삭제
        Map<String, Object> deleteParam = new HashMap<>();

        List<Map<String, Object>> deletetVactnAtrzList = new ArrayList<>();
        List<Map<String, Object>> athcParam = new ArrayList<>();
        String atchmnflId = String.valueOf(dataMap.get("atchmnflId"));

        if(atchmnflId != null){
            athcParam.add(Map.of("tbNm", "ATCHMNFL"));
            athcParam.add(Map.of("atchmnflId", atchmnflId));
        }
        deletetVactnAtrzList.add(0, new HashMap<>() {{ put("tbNm", "VCATN_ATRZ"); }});
        deletetVactnAtrzList.add(1, elctrnAtrzIdMap);

        deleteParam.put("params", deletetVactnAtrzList);
        deleteParam.put("fileParams", athcParam);
        deleteParam.put("dirType", "elec");

        List<Map<String, Object>> deleteAtrzLnList = new ArrayList<>();
        deleteAtrzLnList.add(0, new HashMap<>() {{ put("tbNm", "ATRZ_LN"); }});
        deleteAtrzLnList.add(1, elctrnAtrzIdMap);


        List<Map<String, Object>> deleteRefrnManList = new ArrayList<>();
        deleteRefrnManList.add(0, new HashMap<>() {{ put("tbNm", "REFRN_MAN"); }});
        deleteRefrnManList.add(1, elctrnAtrzIdMap);

        commonService.deleteData(deleteRefrnManList);
        commonService.deleteData(deleteAtrzLnList);
        commonService.deleteFile(deleteParam); // VCATN, ATCHMNFL 삭제
        commonService.deleteData(deleteElctrnAtrzList);

        return 0;
    }

    // 직원휴직저장
    @Transactional
    public static String insertEmpLeave(
            Map<String, Object> elctrnAtrzId,           // 전자결재ID
            Map<String, Object> elctrnTbMap,            // ELCTRN_ATRZ
            Map<String, Object> insertElctrnMap,        // ELCTRN_ATRZ
            Map<String, Object> vcatnTbMap,             // VCATN_ATRZ
            Map<String, Object> insertVcatnMap,         // VCATN_ATRZ
            Map<String, Object> atrzLnTbMap,            // ATRZ_LN
            List<Map<String, Object>> insertAtrzLnMap,  // ATRZ_LN
            Map<String, Object> refrnTbMap,             // REFRN_MAN
            List<Map<String, Object>> insertRefrnMap,   // REFRN_MAN
            List<MultipartFile> attachments
    ) throws SQLException {
        int queryResult = 0;
        final String sortKey = "approvalCode";

        String elctrnAtrzValue = (String) elctrnAtrzId.get("elctrnAtrzId");

        Collections.sort(insertAtrzLnMap, new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> map1, Map<String, Object> map2) {
                Comparable value1 = (Comparable) map1.get(sortKey);
                Comparable value2 = (Comparable) map2.get(sortKey);
                return value1.compareTo(value2);
            }
        });

        // ELCTRN_ATRZ(전자결재) 테이블 저장
        List<Map<String, Object>> insertElctrnList = new ArrayList<>();

        Map<String, Object> selectElctrnAtrz = new HashMap<>();
        selectElctrnAtrz.put("queryId", "indvdlClmMapper.retrieveElctrnAtrzCnt");

        List<Map<String, Object>> selectElctrnAtrzResult = commonService.queryIdSearch(selectElctrnAtrz);

        String refSolYear = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));

        insertElctrnMap.put("elctrnAtrzId", elctrnAtrzValue);
        insertElctrnMap.put("atrzFormDocId", "2d91110f-132a-11ef-bf20-02a5fafa82da");
        insertElctrnMap.put("nowAtrzLnSn", "1");
        insertElctrnMap.put("elctrnAtrzDocNo", refSolYear + "-01-" + (Integer.parseInt(String.valueOf(selectElctrnAtrzResult.get(0).get("rowCnt"))) + 1));
        insertElctrnList.add(0, elctrnTbMap);
        insertElctrnList.add(1, insertElctrnMap);
        queryResult = commonService.insertData(insertElctrnList);

        // VCATN_ATRZ(휴가결재), ATCHMNFL(첨부파일) 테이블 저장
        insertVcatnMap.put("elctrnAtrzId", elctrnAtrzValue);
        insertVcatnMap.put("newVcatnUseDaycnt", 0);
        queryResult = commonService.insertFile(vcatnTbMap, insertVcatnMap, attachments, null, null);

        // ATRZ_LN(결재선) 저장
        List<Map<String, Object>> insertAtrzLnList = new ArrayList<>();
        insertAtrzLnList.add(0, atrzLnTbMap);
        for (int i = 0; i < insertAtrzLnMap.size(); i++) {
            insertAtrzLnMap.get(i).put("elctrnAtrzId", elctrnAtrzValue);
            insertAtrzLnMap.get(i).put("atrzStepCd", insertAtrzLnMap.get(i).get("approvalCode"));
            insertAtrzLnMap.get(i).put("aprvrEmpId", insertAtrzLnMap.get(i).get("empId"));
            insertAtrzLnMap.get(i).put("atrzSttsCD", "VTW00801");
            insertAtrzLnMap.get(i).put("atrzLnSn", i + 1);
            insertAtrzLnList.add(i + 1, insertAtrzLnMap.get(i));
        }
        queryResult = commonService.insertData(insertAtrzLnList);

        // REFRN_MAN(결재선) 저장
        List<Map<String, Object>> insertRefrnManList = new ArrayList<>();
        insertRefrnManList.add(0, refrnTbMap);
        for (int i = 0; i < insertRefrnMap.size(); i++) {
            insertRefrnMap.get(i).put("elctrnAtrzId", elctrnAtrzValue);
            insertRefrnMap.get(i).put("refrnCncrrncClCd", insertRefrnMap.get(i).get("approvalCode"));
            insertRefrnMap.get(i).put("ccSn", i + 1);
            insertRefrnManList.add(i + 1, insertRefrnMap.get(i));
        }
        queryResult = commonService.insertData(insertRefrnManList);

            emailSendService.elecAtrzEmailSend(
                    String.valueOf(insertAtrzLnMap.get(0).get("empId"))
                    ,String.valueOf(insertElctrnMap.get("atrzDmndEmpId"))
                    ,"1"
                    ,"[" + insertVcatnMap.get("vcatnBgngYmd") + "~" + insertVcatnMap.get("vcatnEndYmd") + "] 휴가결재 결재 요청 완료."
                    ,"[" + insertVcatnMap.get("vcatnBgngYmd") + "~" + insertVcatnMap.get("vcatnEndYmd") + "] 휴가결재에 대한 결재가 요청되었습니다."
                    ,false
                    ,""
            );

        return "성공";
    }

    // 직원휴직승인
    public static List<Map<String, Object>> updateEmpLeave(Map<String, Object> params) {
        String errorMsg = "";
        String empId = (String) params.get("empId");
        String sessionEmpId = (String) params.get("sessionEmpId");
        String vcatnBgngYmd = (String) params.get("vcatnBgngYmd");
        String vcatnEndYmd = (String) params.get("vcatnEndYmd");
        int vcatnDeCnt = Integer.parseInt(String.valueOf(params.get("vcatnDeCnt")));
        String vcantYr = vcatnBgngYmd.substring(0, 4);
        
        // 결재 승인 paramList
        List<Map<String, Object>> aprvParamList = new ArrayList<>();
        aprvParamList = (List<Map<String, Object>>) params.get("aprvParam");
        
        List<Map<String, Object>> succMsgList = new ArrayList<>();
        List<Map<String, Object>> errorMsgList = new ArrayList<>();

        // 프로젝트MM조회
        Map<String, Object> retrieveVcatnPrjctMmYnInqMap = new HashMap<>();
        retrieveVcatnPrjctMmYnInqMap.put("queryId", "indvdlClmMapper.retrieveVcatnPrjctMmYnInq");
        retrieveVcatnPrjctMmYnInqMap.put("empId", empId);
        retrieveVcatnPrjctMmYnInqMap.put("vcatnBgngYmd", vcatnBgngYmd);
        retrieveVcatnPrjctMmYnInqMap.put("vcatnEndYmd", vcatnEndYmd);
        List<Map<String, Object>> retrieveVcatnPrjctMmYnInqResult = commonService.queryIdSearch(retrieveVcatnPrjctMmYnInqMap);

        // case_common
        // 결재중인 근무시간이 있거나 승인된 근무시간이 있는 경우
        int cnt = 0;
//        while (cnt < retrieveVcatnPrjctMmYnInqResult.size()) {
//            if (retrieveVcatnPrjctMmYnInqResult.get(cnt).get("atrzDmndSttsCd").equals("VTW03702")) {
//                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 결재중입니다.";
//                break;
//            } else if (retrieveVcatnPrjctMmYnInqResult.get(cnt).get("mmAtrzCmptnYn").equals("Y")) {
//                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 마감되었습니다.";
//                break;
//            }
//            cnt++;
//        }
        for(int i=0; i<retrieveVcatnPrjctMmYnInqResult.size() ; i++){
            if (retrieveVcatnPrjctMmYnInqResult.get(i).get("atrzDmndSttsCd").equals("VTW03702")) {
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(i).get("aplyYmd") + "일의 근무시간이 결재중입니다.";
                break;
            } else if (retrieveVcatnPrjctMmYnInqResult.get(i).get("atrzDmndSttsCd").equals("VTW03703") && retrieveVcatnPrjctMmYnInqResult.get(i).get("md").equals(1)) {
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(i).get("aplyYmd") + "일의 근무시간이 마감되었습니다.";
                break;
            }
        }

        if(errorMsg.equals("")){
            // 휴가정합성 확인 후 회계휴가 updateMap
            Map<String, Object> updateVcatnMng = new HashMap<>();
            updateVcatnMng.put("queryId", "indvdlClmMapper.updateVcatnAltmntMngMdfcn");
            updateVcatnMng.put("vcatnYr", vcantYr);
            updateVcatnMng.put("empId", empId);
            updateVcatnMng.put("mdfcnEmpId", sessionEmpId);
            updateVcatnMng.put("newPblenVcatnUseDaycnt", vcatnDeCnt);
            updateVcatnMng.put("state", "UPDATE");

            List<Map<String, Object>> updateEmpList = new ArrayList<>();

            updateEmpList.add(0, new HashMap<>() {{ put("tbNm", "EMP"); }});
            updateEmpList.add(1, new HashMap<>() {{ put("hdofSttsCD", "VTW00303"); }});
            updateEmpList.add(2, new HashMap<>() {{ put("empId", empId); }});

            Map<String, Object> insertEmpHistMap = new HashMap<>();
            insertEmpHistMap.put("queryId", "indvdlClmMapper.insertEmpHist");
            insertEmpHistMap.put("empId", empId);
            insertEmpHistMap.put("sessionEmpId", sessionEmpId);
            insertEmpHistMap.put("vcatnBgngYmd", vcatnBgngYmd);
            insertEmpHistMap.put("vcatnEndYmd", vcatnEndYmd);

            // 전자결재 승인
            int atrzLnSn = 0;
            try {
            	Map<String, Object> aprvResult = new HashMap<>();
            	
	            aprvResult = ElecAtrzDomain.aprvElecAtrz(aprvParamList);
	            
	            atrzLnSn = Integer.parseInt(String.valueOf(aprvResult.get("atrzLnSn")));
	
	            if(atrzLnSn > 0) {
		            if (String.valueOf(aprvResult.get("atrzStepCd")).equals("VTW00705")) {
		            	// 전자결재 최종 승인 시
		                commonService.updateData(updateEmpList);
		                commonService.queryIdDataControl(updateVcatnMng);
		                commonService.queryIdDataControl(insertEmpHistMap);
		            }
	            } else {
	                Map<String, Object> errorResultMap = new HashMap<>();
	                errorResultMap.put("succMsg", "SUCCESS");
	                errorResultMap.put("atrzLnSn", atrzLnSn);
	                errorMsgList.add(0, errorResultMap);
	                
	                return errorMsgList;
	            }
            } catch (Exception e) {

                Map<String, Object> errorResultMap = new HashMap<>();
                errorResultMap.put("succMsg", "SUCCESS");
                errorResultMap.put("atrzLnSn", atrzLnSn);
                errorMsgList.add(0, errorResultMap);
                
                return errorMsgList;
            }

            Map<String, Object> succResultMap = new HashMap<>();
            succResultMap.put("succMsg", "SUCCESS");
            succResultMap.put("atrzLnSn", atrzLnSn);
            succMsgList.add(0, succResultMap);

            return succMsgList;
        }

        return null;
    }

    /* =================================박지환_작업================================= */

    @Transactional
    public static List<Map<String, Object>> retrieveClturPhstrnActCt(Map<String, Object> param) {

        List<Map<String, Object>> data = new ArrayList<>();

        // 체력단련비 청구
        Map<String, Object> searchParam = new HashMap<>();
        searchParam.put("empId", param.get("empId"));
        searchParam.put("year", param.get("year"));
        searchParam.put("queryId", "indvdlClmMapper.retrieveFtnessTrngCtClmAmt");
        List<Map<String, Object>> resultFtClm = commonService.queryIdSearch(searchParam);
        data.addAll(resultFtClm);
        // 체력단련비 지급
        searchParam.put("queryId", "indvdlClmMapper.retrieveFtnessTrngCtDpstAmt");
        List<Map<String, Object>> resultFtDpst = commonService.queryIdSearch(searchParam);
        data.addAll(resultFtDpst);
        // 체력단련비 지급날짜
        searchParam.put("queryId", "indvdlClmMapper.retrieveFtnessTrngCtDpstYmd");
        List<Map<String, Object>> resultFtDpstYmd = commonService.queryIdSearch(searchParam);
        data.addAll(resultFtDpstYmd);
        // 체력단련비 잔액
        searchParam.put("queryId", "indvdlClmMapper.retrieveFtnessTrngCtCyfdAmt");
        List<Map<String, Object>> resultFtCyfd = commonService.queryIdSearch(searchParam);
        data.addAll(resultFtCyfd);
        // 문화비 청구
        searchParam.put("queryId", "indvdlClmMapper.retrieveClturCtClmAmt");
        List<Map<String, Object>> resultClturClm = commonService.queryIdSearch(searchParam);
        data.addAll(resultClturClm);
        // 문화비 지급
        searchParam.put("queryId", "indvdlClmMapper.retrieveClturCtDpstAmt");
        List<Map<String, Object>> resultClturDpst = commonService.queryIdSearch(searchParam);
        data.addAll(resultClturDpst);
        // 문화비 지급날짜
        searchParam.put("queryId", "indvdlClmMapper.retrieveClturCtDpstYmd");
        List<Map<String, Object>> resultClturDpstYmd = commonService.queryIdSearch(searchParam);
        data.addAll(resultClturDpstYmd);
        // 문화비 잔액
        searchParam.put("queryId", "indvdlClmMapper.retrieveClturCtCyfdAmt");
        List<Map<String, Object>> resultClturCyfd = commonService.queryIdSearch(searchParam);
        data.addAll(resultClturCyfd);
        // 전체 청구 합계
        searchParam.put("queryId", "indvdlClmMapper.retrieveClmAmt");
        List<Map<String, Object>> resultClm = commonService.queryIdSearch(searchParam);
        data.addAll(resultClm);
        // 전체 지급 합계
        searchParam.put("queryId", "indvdlClmMapper.retrieveDpstAmt");
        List<Map<String, Object>> resultDpst = commonService.queryIdSearch(searchParam);
        data.addAll(resultDpst);
        // 전체 잔액 합계
        searchParam.put("queryId", "indvdlClmMapper.retrieveCyfdAmt");
        List<Map<String, Object>> resultCyfd = commonService.queryIdSearch(searchParam);
        data.addAll(resultCyfd);

        return data;
    }
}
