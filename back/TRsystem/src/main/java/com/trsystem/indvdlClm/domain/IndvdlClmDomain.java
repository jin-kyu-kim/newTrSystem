package com.trsystem.indvdlClm.domain;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.trsystem.common.service.ApplicationYamlRead;
import com.trsystem.common.service.CommonService;
import com.trsystem.elecAtrz.domain.ElecAtrzDomain;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Component
public class IndvdlClmDomain {
    private static CommonService commonService;

    @Autowired
    public IndvdlClmDomain(CommonService commonService, ApplicationYamlRead applicationYamlRead){
        IndvdlClmDomain.commonService = commonService;
    }

    public static int insertPrjctMM(List<Map<String, Object>> params){

        List<Map<String, Object>> newList = params.stream().distinct().collect(Collectors.toList());
        List<Map<String, Object>> insertList = new ArrayList<>();
        HashMap<String, Object> tbNm = new HashMap<String, Object>();
        tbNm.put("tbNm", "PRJCT_INDVDL_CT_MM");
        insertList.add(tbNm);

        for(int i = 0; i < newList.size(); i++){
            List <Map<String, Object>> searchList = new ArrayList<>();
            searchList.add(tbNm);
            searchList.add(newList.get(i));

            List<Map<String, Object>> list = commonService.commonSelect(searchList);
            if(list.isEmpty()){
                insertList.add(newList.get(i));
            }
        }
        int result = commonService.insertData(insertList);
        return result;
    }

    public static int insertPrjctHis(List<Map<String, Object>> params){
        List<Map<String, Object>> histList = new ArrayList<>();
        HashMap<String, Object> tbNmHist = new HashMap<String, Object>();
        tbNmHist.put("tbNm", "PRJCT_ATRZ_HIST");
        histList.add(tbNmHist);
        for(int i = 0; i < params.size(); i++){
            Map<String, Object> newParam = params.get(i);
            newParam.put("atrzDmndSttsCd","VTW03701");
            newParam.put("prjctAtrzHistSn", 1);
            histList.add(newParam);
        }
        int result = commonService.insertData(histList);
        return result;
    }

    /**
     * 프로젝트 시간 저장
     */
    public static List<Map<String, Object>> insertPrjctMmAply(List<Map<String, Object>> params, List<Map<String, Object>> deleteParams){
        int result;

        for(int i = 0; i < deleteParams.size(); i++){
            Map<String, Object> deletePrjctMmAtrzStateMap = new HashMap<>();
            deletePrjctMmAtrzStateMap = deleteParams.get(i);
            deletePrjctMmAtrzStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzDel");
            List<Map<String, Object>> deletePrjctMmAtrzState = commonService.queryIdSearch(deletePrjctMmAtrzStateMap);

            Map<String, Object> deletePrjctMmAplyStateMap = new HashMap<>();
            deletePrjctMmAplyStateMap = deleteParams.get(i);
            deletePrjctMmAplyStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyDel");
            List<Map<String, Object>> deletePrjctMmAplyState = commonService.queryIdSearch(deletePrjctMmAplyStateMap);
        }

        for (int i = 0; i < params.size(); i++){
            // PRJCT_MM_ATRZ(프로젝트MM결재) 기존 데이터 삭제
            Map<String, Object> deletePrjctMmAtrzMap = new HashMap<>();
            deletePrjctMmAtrzMap = params.get(i);

            if(!deletePrjctMmAtrzMap.get("atrzDmndSttsCd").equals("VTW03703")){
                deletePrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzDel");
                List<Map<String, Object>> deletePrjctMmAtrzData = commonService.queryIdSearch(deletePrjctMmAtrzMap);
            }

            // PRJCT_MM_APLY(프로젝트MM신청) 기존 데이터 삭제
            Map<String, Object> deletePrjctMmAplyMap = new HashMap<>();
            deletePrjctMmAplyMap = params.get(i);
            if(!deletePrjctMmAplyMap.get("atrzDmndSttsCd").equals("VTW03703")) {
                deletePrjctMmAplyMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyDel");
                List<Map<String, Object>> deletePrjctMmAplyData = commonService.queryIdSearch(deletePrjctMmAplyMap);
            }
        }


        List<Map<String, Object>> insertMap = new ArrayList<>();
        for (Map<String, Object> param : params) {
            param.put("tbNm", "PRJCT_INDVDL_CT_MM");
            insertMap.add(param);

            // PRJCT_INDVDL_CT_MM(프로젝트개인비용MM) INSERT/UPDATE
            Map<String, Object> mergePrjctIndvdlCtMmMap = new HashMap<>();
            mergePrjctIndvdlCtMmMap = param;
            mergePrjctIndvdlCtMmMap.put("queryId", "indvdlClmMapper.retrievePrjctIndvdlCtMmStrg");
            List<Map<String, Object>> mergePrjctIndvdlCtMmData = commonService.queryIdSearch(mergePrjctIndvdlCtMmMap);

            Map<String, Object> insertPrjctMmAplyMap = new HashMap<>();
            insertPrjctMmAplyMap = param;
            if (!insertPrjctMmAplyMap.get("atrzDmndSttsCd").equals("VTW03703")) {
                insertPrjctMmAplyMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyStrg");
                List<Map<String, Object>> insertPrjctMmAplyResult = commonService.queryIdSearch(insertPrjctMmAplyMap);
            }

            Map<String, Object> insertPrjctMmAtrzMap = new HashMap<>();
            insertPrjctMmAtrzMap = param;
            if (!insertPrjctMmAtrzMap.get("atrzDmndSttsCd").equals("VTW03703")) {
                insertPrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzStrg");
                List<Map<String, Object>> insertPrjctMmAtrzResult = commonService.queryIdSearch(insertPrjctMmAtrzMap);
            }
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

        if(retrieveVcatnStrgInfoResult.size() == 2){
            vcatnFlag = "composite";
        } else if(retrieveVcatnStrgInfoResult.get(0).toString().indexOf("NEW") > -1){
            vcatnFlag = "new";
        } else if(retrieveVcatnStrgInfoResult.get(0).toString().indexOf("ACCOUNT") > -1) {
            vcatnFlag = "account";
        }

        int cnt = 0;
        while(cnt < retrieveVcatnPrjctMmYnInqResult.size()){
            if(retrieveVcatnPrjctMmYnInqResult.get(cnt).get("atrzDmndSttsCd").equals("VTW03702")){
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 결재중입니다.";
                break;
            } else if(retrieveVcatnPrjctMmYnInqResult.get(cnt).get("mmAtrzCmptnYn").equals("Y")) {
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 마감되었습니다.";
                break;
            }
            cnt++;
        }

        if(vcatnFlag.equals("account")){
            if(Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(0).get("vcatnRemndrDaycnt"))) - Double.parseDouble(String.valueOf(insertVcatnMap.get("vcatnDeCnt"))) < -15){
                errorMsg = "휴가잔여일수는 -15일을 넘을 수 없습니다.";
            }
        } else if(vcatnFlag.equals("composite")){
            Map<String, Object> refNewVcatnMngMap = new HashMap<>();                // 신규휴가정보
            Map<String, Object> refVcatnMngMap= new HashMap<>();                    // 회계휴가정보

            List<Map<String, Object>> insertNewVcatnMngList = new ArrayList<>();    // 신규휴가입력정보
            List<Map<String, Object>> insertVcatnMngList = new ArrayList<>();       // 회계휴가입력정보

            Map<String, Object> insertTotalVcatnMngMap = new HashMap<>();           // 휴가입력정보

            // 신규_회계 잔여일수 정합성 확인
            for (int i = 0; i < retrieveVcatnStrgInfoResult.size(); i++){
                if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("NEW") > -1){
                    refNewVcatnMngMap.putAll(retrieveVcatnStrgInfoResult.get(i));
                } else if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("ACCOUNT") > -1){
                    refVcatnMngMap.putAll(retrieveVcatnStrgInfoResult.get(i));
                }
            }

            // 신규_회계휴가 사용가능일수 정합성 확인
            for (int i = 0; i < retrieveVcatnUseKndInqResult.size(); i++){
                if(retrieveVcatnUseKndInqResult.get(i).toString().indexOf("NEW") > -1){
                    insertNewVcatnMngList.add(retrieveVcatnUseKndInqResult.get(i));
                } else if(retrieveVcatnUseKndInqResult.get(i).toString().indexOf("ACCOUNT") > -1){
                    insertVcatnMngList.add(retrieveVcatnUseKndInqResult.get(i));
                }
            }

            double newRemndrDaycnt = Double.parseDouble(String.valueOf(refNewVcatnMngMap.get("newRemndrDaycnt")));
            double accountRemndrDaycnt = Double.parseDouble(String.valueOf(refVcatnMngMap.get("vcatnRemndrDaycnt")));

            // case_A
            // 신규배정휴가가 존재하고 잔여휴가일수에서 휴가신청이 가능한 경우
            if(insertNewVcatnMngList.size() > 0 && newRemndrDaycnt >= insertNewVcatnMngList.size()){
                newVcatnUseDaycntValue = insertNewVcatnMngList.size();
                insertTotalVcatnMngMap.put("newVcatnUseDaycnt", insertNewVcatnMngList.size());
            }
            // case_B
            // 신규배정휴가가 존재하지만 잔여휴가일수에서 휴가신청이 불가능한 경우
            if(insertNewVcatnMngList.size() > 0 && newRemndrDaycnt < insertNewVcatnMngList.size()){
                int valiFalg = 0; // 회계년도휴가 사용휴가일수
                for(int i = (int) (insertNewVcatnMngList.size() - newRemndrDaycnt); i < insertNewVcatnMngList.size(); i++) {
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
                if(valiFalg == insertNewVcatnMngList.size() - newRemndrDaycnt){
                    // case_B1_1
                    // 회계년도휴가 사용일수가 -15일이 넘지않는 경우
                    if(accountRemndrDaycnt - valiFalg >= -15){
//                        insertTotalVcatnMngMap.put("vcatnDeCnt", valiFalg);
                        newVcatnUseDaycntValue = (int) newRemndrDaycnt;
                        insertTotalVcatnMngMap.put("newVcatnUseDaycnt", newRemndrDaycnt);
                    }
                    // case_B1_2
                    // 회계년도휴가 사용일수가 -15일이 넘는 경우
                    else if(accountRemndrDaycnt - valiFalg < -15){
                        errorMsg = "휴가잔여일수는 -15일을 넘을 수 없습니다.";
                    }
                }
                // case_B2
                // 회계년도휴가에서 사용불가능한 경우
                else {
                    errorMsg = "잔여휴가일수가 부족합니다.";
                }
            }

            System.out.println("=============================================");
            System.out.println("insertTotalVcatnMngMap : " + insertTotalVcatnMngMap);
            System.out.println("newVcatnUseDaycntValue : " + newVcatnUseDaycntValue);
            System.out.println("errorMsg : " + errorMsg);
            System.out.println("=============================================");

        }

        if(errorMsg.equals("")){
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
            insertElctrnMap.put("elctrnAtrzId", elctrnAtrzValue);
            insertElctrnMap.put("atrzFormDocId", "9632d577-f0bd-11ee-9b25-000c2956283f");
            insertElctrnMap.put("nowAtrzLnSn", "1");
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
            for (int i = 0 ; i < insertAtrzLnMap.size(); i++){
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
            for (int i = 0 ; i < insertRefrnMap.size(); i++){
                insertRefrnMap.get(i).put("elctrnAtrzId", elctrnAtrzValue);
                insertRefrnMap.get(i).put("refrnCncrrncClCd", insertRefrnMap.get(i).get("approvalCode"));
                insertRefrnMap.get(i).put("ccSn", i + 1);
                insertRefrnManList.add(i + 1, insertRefrnMap.get(i));
            }
            queryResult = commonService.insertData(insertRefrnManList);

            return "성공";
        } else {
            return errorMsg;
        }

//        int result = 0;
//        String elctrnAtrzValue = (String) elctrnAtrzId.get("elctrnAtrzId");
//
//        final String sortKey = "approvalCode";
//        Collections.sort(insertAtrzLnMap, new Comparator<Map<String, Object>>() {
//            @Override
//            public int compare(Map<String, Object> map1, Map<String, Object> map2) {
//                Comparable value1 = (Comparable) map1.get(sortKey);
//                Comparable value2 = (Comparable) map2.get(sortKey);
//                return value1.compareTo(value2);
//            }
//        });
//
//        // ELCTRN_ATRZ(전자결재) 테이블 저장
//        List<Map<String, Object>> insertElctrnList = new ArrayList<>();
//        insertElctrnMap.put("elctrnAtrzId", elctrnAtrzValue);
//        insertElctrnMap.put("atrzFormDocId", "9632d577-f0bd-11ee-9b25-000c2956283f");
//        insertElctrnMap.put("nowAtrzLnSn", "1");
//        insertElctrnList.add(0, elctrnTbMap);
//        insertElctrnList.add(1, insertElctrnMap);
//        result = commonService.insertData(insertElctrnList);
//
//        // VCATN_ATRZ(휴가결재), ATCHMNFL(첨부파일) 테이블 저장
//        insertVcatnMap.put("elctrnAtrzId", elctrnAtrzValue);
//        result = commonService.insertFile(vcatnTbMap, insertVcatnMap, attachments, null, null);
//
//        // ATRZ_LN(결재선) 저장
//        List<Map<String, Object>> insertAtrzLnList = new ArrayList<>();
//        insertAtrzLnList.add(0, atrzLnTbMap);
//        for (int i = 0 ; i < insertAtrzLnMap.size(); i++){
//            insertAtrzLnMap.get(i).put("elctrnAtrzId", elctrnAtrzValue);
//            insertAtrzLnMap.get(i).put("atrzStepCd", insertAtrzLnMap.get(i).get("approvalCode"));
//            insertAtrzLnMap.get(i).put("aprvrEmpId", insertAtrzLnMap.get(i).get("empId"));
//            insertAtrzLnMap.get(i).put("atrzSttsCD", "VTW00801");
//            insertAtrzLnMap.get(i).put("atrzLnSn", i + 1);
//            insertAtrzLnList.add(i + 1, insertAtrzLnMap.get(i));
//        }
//        result = commonService.insertData(insertAtrzLnList);
//
//        // REFRN_MAN(결재선) 저장
//        List<Map<String, Object>> insertRefrnManList = new ArrayList<>();
//        insertRefrnManList.add(0, refrnTbMap);
//        for (int i = 0 ; i < insertRefrnMap.size(); i++){
//            insertRefrnMap.get(i).put("elctrnAtrzId", elctrnAtrzValue);
//            insertRefrnMap.get(i).put("refrnCncrrncClCd", insertRefrnMap.get(i).get("approvalCode"));
//            insertRefrnMap.get(i).put("ccSn", i + 1);
//            insertRefrnManList.add(i + 1, insertRefrnMap.get(i));
//        }
//        result = commonService.insertData(insertRefrnManList);
















        // 2024_04_04
        // 회의 이후 작업
//
//        String caseFlag = "account";
//        int count = 0;
//
//        // VCATN_MNG(휴가관리) 회계_신규 휴가일수 정합성 확인
//        Map<String, Object> retrieveVcatnStrgInfoMap = new HashMap<>();
//        retrieveVcatnStrgInfoMap = insertVcatnMap;
//        retrieveVcatnStrgInfoMap.put("queryId", "indvdlClmMapper.retrieveVcatnStrgInfoInq");
//        List<Map<String, Object>> retrieveVcatnStrgInfoResult = commonService.queryIdSearch(retrieveVcatnStrgInfoMap);
//
//        System.out.println("=====================================");
//        System.out.println("retrieveVcatnStrgInfoResult : " + retrieveVcatnStrgInfoResult);
//        System.out.println("=====================================");
//
//        /**
//         * 휴가시작일자기준으로 신규휴가배정기간 존재여부 확인
//         */
//        while( count < retrieveVcatnStrgInfoResult.size() ){
//            if(retrieveVcatnStrgInfoResult.get(count).toString().indexOf("NEW") > -1){
//                caseFlag = "new";
//                break;
//            }
//            count++;
//        }
//
//
//        /**
//         * caseFlag
//         * 서버처리
//         * 1) 신규배정휴가가 존재하고 휴가사용일수가 신규배정휴가안에서 사용가능한 경우
//         * 2) 신규배정휴가가 존재하고 휴가사용일수가 신규배정휴가안에서 사용불가능하지만 회계배정휴가가 존재하여 회계배정휴가와 함께 사용하는 경우
//         * 3) 신규배정휴가가 존재하고 휴가사용일수가 신규배정휴가안에서 사용불가능하며 회계배정휴가가 존재하지 않는 경우
//         * 4) 신규배정휴가가 존재하지않고 회계배정휴가가 존재하며 회계배정휴가안에서 사용가능한 경우
//         * 5) 신규배정휴가가 존재하지않고 회계배정휴가가 존재하며 회계배정휴가안에서 사용불가능한 경우
//         * 6) 신규배정휴가가 존재하지않고 회계배정휴가도 존재하지 않는 경우
//         *
//         * 화면처리
//         * 1) 현재 회계년도가 아닌 다른회계년도 휴가 신청하는 경우
//         * 2) 현재 회계년도가 아니지만 신규배정휴가기간 휴가 신청하는 경우
//         * 3) 현재날짜의 이전날짜에 휴가 신청하는 경우
//         * 4) 휴가등록기간 불가능 기간에 신청하는 경우
//         * 5) 휴가종료일자이후 휴가취소하는 경우
//         */
//        Map<String, Object> refNewVcatnMngMap = new HashMap<>();
//        Map<String, Object> refVcatnMngMap= new HashMap<>();
//
//        for (int i = 0; i < retrieveVcatnStrgInfoResult.size(); i++){
//            if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("NEW") > -1){
//                refNewVcatnMngMap = retrieveVcatnStrgInfoResult.get(i);
//            } else if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("ACCOUNT") > -1){
//                refVcatnMngMap = retrieveVcatnStrgInfoResult.get(i);
//            }
//        }
//
//        Map<String, Object> insertNewVcatnMngMap = new HashMap<>();
//        Map<String, Object> insertVcatnMngMap = new HashMap<>();
//        for (int i = 0; i < retrieveVcatnStrgInfoResult.size(); i++){
//            if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("NEW") > -1){
//                double newRemCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newRemndrDaycnt")));           // 신규기준잔여일수
//                double newUseCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newUseDaycnt")));              // 신규기존사용일수
//                double newAddUseCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoMap.get("vcatnDeCnt")));                       // 신규기준추가사용일수
//                double newTotalCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newVcatnAltmntDaycnt")));    // 신규기준휴가배정일수
//                double overUseCnt;
//
//                if(newUseCnt + newAddUseCnt <= newTotalCnt){
//                    insertNewVcatnMngMap.put("vcatnAltmntSn", retrieveVcatnStrgInfoResult.get(i).get("vcatnAltmntSn"));
//                    insertNewVcatnMngMap.put("empId", retrieveVcatnStrgInfoResult.get(i).get("empId"));
//                    insertNewVcatnMngMap.put("vcatnYr", retrieveVcatnStrgInfoResult.get(i).get("vcatnYr"));
//                    insertNewVcatnMngMap.put("useDaycnt", retrieveVcatnStrgInfoResult.get(i).get("useDaycnt"));
//                    insertNewVcatnMngMap.put("vcatnRemndrDaycnt", retrieveVcatnStrgInfoResult.get(i).get("vcatnRemndrDaycnt"));
//                    insertNewVcatnMngMap.put("newUseDaycnt", newUseCnt + newAddUseCnt);
//                    insertNewVcatnMngMap.put("newRemndrDaycnt", newTotalCnt - newUseCnt - newAddUseCnt);
//                    insertNewVcatnMngMap.put("mdfcnEmpId", retrieveVcatnStrgInfoMap.get("empId"));
//                } else if(newUseCnt + newAddUseCnt > newTotalCnt){
//                    overUseCnt = newRemCnt + newAddUseCnt - newTotalCnt;
//                    insertNewVcatnMngMap.put("vcatnAltmntSn", retrieveVcatnStrgInfoResult.get(i).get("vcatnAltmntSn"));
//                    insertNewVcatnMngMap.put("empId", retrieveVcatnStrgInfoResult.get(i).get("empId"));
//                    insertNewVcatnMngMap.put("vcatnYr", retrieveVcatnStrgInfoResult.get(i).get("vcatnYr"));
//                    insertNewVcatnMngMap.put("useDaycnt", retrieveVcatnStrgInfoResult.get(i).get("useDaycnt"));
//                    insertNewVcatnMngMap.put("vcatnRemndrDaycnt", retrieveVcatnStrgInfoResult.get(i).get("vcatnRemndrDaycnt"));
//                    insertNewVcatnMngMap.put("newUseDaycnt", newTotalCnt);
//                    insertNewVcatnMngMap.put("newRemndrDaycnt", 0);
//                    insertNewVcatnMngMap.put("mdfcnEmpId", retrieveVcatnStrgInfoMap.get("empId"));
//
//                    for (int j = 0; j < retrieveVcatnStrgInfoResult.size(); j++){
//                        if(retrieveVcatnStrgInfoResult.get(j).toString().indexOf("ACCOUNT") > -1){
//                            double remCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(j).get("vcatnRemndrDaycnt")));        // 회계기준잔여일수
//                            double useCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(j).get("useDaycnt")));                // 회계기준사용일수
//                            double totalCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(j).get("vcatnAltmntDaycnt")));      // 회계기준휴가배정일수
//
//                            insertVcatnMngMap.put("vcatnAltmntSn", retrieveVcatnStrgInfoResult.get(j).get("vcatnAltmntSn"));
//                            insertVcatnMngMap.put("empId", retrieveVcatnStrgInfoResult.get(j).get("empId"));
//                            insertVcatnMngMap.put("vcatnYr", retrieveVcatnStrgInfoResult.get(j).get("vcatnYr"));
//                            insertVcatnMngMap.put("useDaycnt", useCnt - overUseCnt);
//                            insertVcatnMngMap.put("vcatnRemndrDaycnt", totalCnt - remCnt + overUseCnt);
//                            insertVcatnMngMap.put("newUseDaycnt", retrieveVcatnStrgInfoResult.get(j).get("newUseDaycnt"));
//                            insertVcatnMngMap.put("newRemndrDaycnt", retrieveVcatnStrgInfoResult.get(j).get("newRemndrDaycnt"));
//                            insertVcatnMngMap.put("mdfcnEmpId", retrieveVcatnStrgInfoMap.get("empId"));
//                        } else {
//                            System.out.println("============================================");
//                            System.out.println("회계기준휴가 없으면서 신규휴가 넘어서 사용");
//                            System.out.println("============================================");
//                        }
//                    }
//                }
//            } else {
//            }
//        }

//        System.out.println("=====================================");
//        System.out.println("입사기준휴가");
//        System.out.println("insertNewVcatnMngMap : " + insertNewVcatnMngMap);
//        System.out.println("=====================================");
//
//        System.out.println("=====================================");
//        System.out.println("회계기준휴가");
//        System.out.println("insertVcatnMngMap : " + insertVcatnMngMap);
//        System.out.println("=====================================");

//        insertVcatnMap.put("state", "UPDATE");
//        result = commonService.queryIdDataControl(insertVcatnMap);


//        commonService.queryIdDataControl(param);
//        commonService.queryIdDataControl(param);
//        commonService.queryIdDataControl(param);

    }

    public static List<Map<String, Object>> updatePrjctMmAply(List<Map<String, Object>> params){
        int result;

        for(int i = 0; i < params.size(); i++){
            Map<String, Object> updatePrjctMmAtrzMap = new HashMap<>();
            updatePrjctMmAtrzMap = params.get(i);
            updatePrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmSttsInq");
            List<Map<String, Object>> updatePrjctMmAtrzResult = commonService.queryIdSearch(updatePrjctMmAtrzMap);
        }

        return null;
    }

    public static List<Map<String, Object>> updateVcatnMng(Map<String, Object> params) throws SQLException{
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
        aprvParamList = (List<Map<String, Object>>)params.get("aprvParam");

        List<Map<String, Object>> errorMsgList = new ArrayList<>();

        // 프로젝트MM조회
        Map<String, Object> retrieveVcatnPrjctMmYnInqMap = new HashMap<>();
        retrieveVcatnPrjctMmYnInqMap.put("queryId", "indvdlClmMapper.retrieveVcatnPrjctMmYnInq");
        retrieveVcatnPrjctMmYnInqMap.put("empId", empId);
        retrieveVcatnPrjctMmYnInqMap.put("vcatnBgngYmd", vcatnBgngYmd);
        retrieveVcatnPrjctMmYnInqMap.put("vcatnEndYmd", vcatnEndYmd);
        List<Map<String, Object>> retrieveVcatnPrjctMmYnInqResult = commonService.queryIdSearch(retrieveVcatnPrjctMmYnInqMap);

        System.out.println("=============================");
        System.out.println("retrieveVcatnPrjctMmYnInqResult : " + retrieveVcatnPrjctMmYnInqResult);
        System.out.println("=============================");

        // case_common
        // 결재중인 근무시간이 있거나 승인된 근무시간이 있는 경우
        int cnt = 0;
        while(cnt < retrieveVcatnPrjctMmYnInqResult.size()){
            if(retrieveVcatnPrjctMmYnInqResult.get(cnt).get("atrzDmndSttsCd").equals("VTW03702")){
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 결재중입니다.";
                break;
            } else if(retrieveVcatnPrjctMmYnInqResult.get(cnt).get("mmAtrzCmptnYn").equals("Y")) {
                errorMsg = retrieveVcatnPrjctMmYnInqResult.get(cnt).get("aplyYmd") + "일의 근무시간이 마감되었습니다.";
                break;
            }
            cnt++;
        }


        List<Map<String, Object>> selectVcatnAtrz = new ArrayList<>();

        selectVcatnAtrz.add(0, new HashMap<>(){{ put("tbNm", "VCATN_ATRZ"); }});
        selectVcatnAtrz.add(1, new HashMap<>(){{ put("elctrnAtrzId", elctrnAtrzId); }});

        // 사용휴가정보조회
        List<Map<String, Object>> selectVcatnAtrzResult = commonService.commonSelect(selectVcatnAtrz);

        System.out.println("======================================");
        System.out.println("selectVcatnAtrzResult : " + selectVcatnAtrzResult);
        System.out.println("======================================");


        Map<String, Object> selectVcatnMng = new HashMap<>();

        selectVcatnMng.put("queryId", "indvdlClmMapper.retrieveVcatnStrgInfoInq");
        selectVcatnMng.put("empId", empId);
        selectVcatnMng.put("vcatnBgngYmd", selectVcatnAtrzResult.get(0).get("vcatnBgngYmd"));

        // 휴가정합성정보조회
        List<Map<String, Object>> selectVcatnMngResult = commonService.queryIdSearch(selectVcatnMng);

        System.out.println("======================================");
        System.out.println("selectVcatnMngResult : " + selectVcatnMngResult);
        System.out.println("======================================");


        // 신규_회계휴가 정보
        Map<String, Object> refNewVcatnMngMap = new HashMap<>();                // 신규휴가정보
        Map<String, Object> refVcatnMngMap= new HashMap<>();                    // 회계휴가정보

        // 신규_회계 잔여일수 정합성 확인
        for (int i = 0; i < selectVcatnMngResult.size(); i++){
            if(selectVcatnMngResult.get(i).toString().indexOf("NEW") > -1){
                refNewVcatnMngMap.putAll(selectVcatnMngResult.get(i));
            } else if(selectVcatnMngResult.get(i).toString().indexOf("ACCOUNT") > -1){
                refVcatnMngMap.putAll(selectVcatnMngResult.get(i));
            }
        }

        // 휴가신청사용일수
//        Double vcatnDeCnt = (Double) selectVcatnAtrzResult.get(0).get("vcatnDeCnt");
//        Double newVcatnUseDaycnt = (Double) selectVcatnAtrzResult.get(0).get("newVcatnUseDaycnt");
        Double vcatnDeCnt = Double.parseDouble(String.valueOf(selectVcatnAtrzResult.get(0).get("vcatnDeCnt")));
        Double newVcatnUseDaycnt = Double.parseDouble(String.valueOf(selectVcatnAtrzResult.get(0).get("newVcatnUseDaycnt")));
        
        // 잔여휴가일수
//        Double useVcatnDeCnt = (Double) refVcatnMngMap.get("vcatnRemndrDaycnt");
//        Double useNewVcatnUseDaycnt = (Double) refNewVcatnMngMap.get("newRemndrDaycnt");

        Double useVcatnDeCnt = Double.parseDouble(String.valueOf(refVcatnMngMap.get("vcatnRemndrDaycnt")));
        Double useNewVcatnUseDaycnt = Double.parseDouble(String.valueOf(refNewVcatnMngMap.get("newRemndrDaycnt")));

        
        // 휴가정합성 확인 후 회계휴가 updateMap
        Map<String, Object> updateVcatnMng = new HashMap<>();
        updateVcatnMng.put("queryId", "indvdlClmMapper.retrieveVcatnAltmntMngMdfcn");
        updateVcatnMng.put("vcatnYr", refVcatnMngMap.get("vcatnYr"));
        updateVcatnMng.put("empId", empId);
        updateVcatnMng.put("mdfcnEmpId", mdfcnEmpId);
        updateVcatnMng.put("state", "UPDATE");

        // 휴가정합성 확인 후 신규휴가 updateMap
        Map<String, Object> updateNewVcatnMng = new HashMap<>();
        updateNewVcatnMng.put("queryId", "indvdlClmMapper.retrieveNewVcatnAltmntMngMdfcn");
        updateNewVcatnMng.put("vcatnYr", refNewVcatnMngMap.get("vcatnYr"));
        updateNewVcatnMng.put("empId", empId);
        updateNewVcatnMng.put("mdfcnEmpId", mdfcnEmpId);
        updateNewVcatnMng.put("state", "UPDATE");
        
        // case_A
        // 신규휴가만사용
        if(Objects.equals(vcatnDeCnt, newVcatnUseDaycnt)){
            caseFlag = 1;
            // case_1
            // 신규휴가사용가능할 경우
            if(useNewVcatnUseDaycnt >= newVcatnUseDaycnt){
                updateNewVcatnMng.put("newUseDaycnt", newVcatnUseDaycnt);
                updateNewVcatnMng.put("newRemndrDaycnt", useNewVcatnUseDaycnt - newVcatnUseDaycnt);
            }
            // case_2
            // 신규휴가사용불가능할 경우
            else if(useNewVcatnUseDaycnt < newVcatnUseDaycnt){
                errorMsg += "입사일기준 잔여휴가일수가 부족합니다.\n";
            }
        }

        // case_B
        // 회계휴가만사용
        if(newVcatnUseDaycnt == 0){
            caseFlag = 2;
            // case_B1
            // 공가사용하는 경우
            if(vcatnTyCd.equals("VTW01204") || vcatnTyCd.equals("VTW01205") || vcatnTyCd.equals("VTW01206")){
                updateVcatnMng.put("pblenVcatnUseDaycnt", vcatnDeCnt);
            }
            // case_B2
            // 회계휴가사용하는 경우
            else {
                // case_B2_1
                // 회계휴가사용가능한 경우
                if(useVcatnDeCnt - vcatnDeCnt >= -15){
                    updateVcatnMng.put("useDaycnt", vcatnDeCnt);
                    updateVcatnMng.put("vcatnRemndrDaycnt", useVcatnDeCnt - vcatnDeCnt);
                }
                
                // case_B2_1
                // 회계휴가잔여일수가 -15일이 넘는 경우
                else if(useVcatnDeCnt - vcatnDeCnt < -15){
                    errorMsg += "휴가잔여일수는 -15일을 넘을 수 없습니다.\n";
                }
            }
        }

        // case_C
        // 신규휴가와 회계휴가 사용
        if(newVcatnUseDaycnt != 0 && !Objects.equals(vcatnDeCnt, newVcatnUseDaycnt)){
            caseFlag = 3;
            // case_C1
            // 신규휴가사용불가능할 경우
            if(useNewVcatnUseDaycnt < newVcatnUseDaycnt){
                errorMsg += "입사일기준 잔여휴가일수가 부족합니다.\n";
            }
            // case_C2
            // 회계휴가잔여일수가 -15일이 넘는 경우
            else if(useVcatnDeCnt - vcatnDeCnt - newVcatnUseDaycnt < -15){
                errorMsg += "휴가잔여일수는 -15일을 넘을 수 없습니다.\n";
            }
            // case_C3
            // 사용가능한 경우
            else {
                updateNewVcatnMng.put("newUseDaycnt", newVcatnUseDaycnt);
                updateNewVcatnMng.put("newRemndrDaycnt", useNewVcatnUseDaycnt - newVcatnUseDaycnt);

                updateVcatnMng.put("useDaycnt", vcatnDeCnt - newVcatnUseDaycnt);
                updateVcatnMng.put("vcatnRemndrDaycnt", useVcatnDeCnt - vcatnDeCnt - newVcatnUseDaycnt);
            }
        }
        
        int atrzLnSn = 0;

        if(errorMsg.isEmpty()){
            try {
                switch (caseFlag){
                    case 1 : {
                    	// 승인처리
                    	atrzLnSn = ElecAtrzDomain.aprvElecAtrz(aprvParamList);
                    	
                    	if(atrzStepCd.equals("VTW00705")) {
                    		commonService.queryIdDataControl(updateNewVcatnMng);
                    	}
                    }
                    case 2 : {
                    	// 승인처리
                    	atrzLnSn = ElecAtrzDomain.aprvElecAtrz(aprvParamList);
                    	
                    	if(atrzStepCd.equals("VTW00705")) {
                    		commonService.queryIdDataControl(updateVcatnMng);
                    	}
                    }
                    case 3 : {
                    	// 승인처리
                    	atrzLnSn = ElecAtrzDomain.aprvElecAtrz(aprvParamList);
                    	
                    	if(atrzStepCd.equals("VTW00705")) {
                    		commonService.queryIdDataControl(updateNewVcatnMng);
                    		commonService.queryIdDataControl(updateVcatnMng);
                    	}
                    }
                }
                
                Map<String, Object> aprvResult =  new HashMap<>();
                aprvResult.put("succMsg", "SUCCESS");
                aprvResult.put("atrzLnSn", atrzLnSn);
                succMsgList.add(0, aprvResult);
                
                return succMsgList;
                
            } catch (Exception e){
                e.printStackTrace();
            }
        } else {
            String finalErrorMsg = errorMsg;
            errorMsgList.add(0, new HashMap<>(){{ put("errorMsg ", finalErrorMsg); }});

            return errorMsgList;
        }

        // 성공리턴추가
        return null;
    }
    public static int plusClturPhstrnActCt (Map<String, Object> param){
        Map<String, Object> tbNm = new HashMap<>();
        tbNm.put("tbNm", "CLTUR_PHSTRN_ACT_CT");

        Map<String, Object> data = new HashMap<>();
        data.put("empId", param.get("empId"));
        data.put("clmYm", param.get("clmYmd").toString().substring(0,6));

        List<Map<String, Object>> searchParam = new ArrayList<>();
        searchParam.add(tbNm);
        searchParam.add(data);
        List<Map<String, Object>> search = commonService.commonSelect(searchParam);

        int result = 0;
        if (!search.isEmpty()) {
            Map<String, Object> shResult= search.get(0);
            Map<String, Object> updateData = new HashMap<>();
            int amt = 0;
            if(param.get("clturPhstrnSeCd").equals("VTW00901")){
                if(shResult.get("clturCtClmAmt") != null){
                    amt = (int)shResult.get("clturCtClmAmt");
                }
                updateData.put("clturCtClmAmt", amt + (int)param.get("clmAmt"));
            } else if (param.get("clturPhstrnSeCd").equals("VTW00902")) {
                if(shResult.get("ftnessTrngCtClmAmt") != null){
                    amt = (int)shResult.get("ftnessTrngCtClmAmt");
                }
                updateData.put("ftnessTrngCtClmAmt", amt + (int)param.get("clmAmt"));
            }
            updateData.put("clmAmt", (int)shResult.get("clmAmt")+(int)param.get("clmAmt"));

            List<Map<String, Object>> updateParam = new ArrayList<>();
            updateParam.add(tbNm);
            updateParam.add(updateData);
            updateParam.add(data);
            result = commonService.updateData(updateParam);
        } else {
            Map<String, Object> insertData = new HashMap<>();
            insertData.put("empId", param.get("empId"));
            insertData.put("clmYm", param.get("clmYmd").toString().substring(0,6));
            if(param.get("clturPhstrnSeCd").equals("VTW00901")){
                insertData.put("clturCtClmAmt", param.get("clmAmt"));
            } else if (param.get("clturPhstrnSeCd").equals("VTW00902")) {
                insertData.put("ftnessTrngCtClmAmt", param.get("clmAmt"));
            }
            insertData.put("clmAmt", param.get("clmAmt"));

            List<Map<String, Object>> insertParam = new ArrayList<>();
            insertParam.add(tbNm);
            insertParam.add(insertData);
            result = commonService.insertData(insertParam);
        }
        return result;
    }

    public static int minusClturPhstrnActCt (Map<String, Object> param){
        Map<String, Object> tbNm = new HashMap<>();
        tbNm.put("tbNm", "CLTUR_PHSTRN_ACT_CT");

        Map<String, Object> data = new HashMap<>();
        data.put("empId", param.get("empId"));
        data.put("clmYm", param.get("clmYmd").toString().substring(0,6));

        List<Map<String, Object>> searchParam = new ArrayList<>();
        searchParam.add(tbNm);
        searchParam.add(data);
        List<Map<String, Object>> search = commonService.commonSelect(searchParam);

        Map<String, Object> shResult= search.get(0);
        Map<String, Object> updateData = new HashMap<>();
        if(param.get("clturPhstrnSeCd").equals("VTW00901")){
            updateData.put("clturCtClmAmt", (int)shResult.get("clturCtClmAmt") - (int)param.get("clmAmt"));
        } else if (param.get("clturPhstrnSeCd").equals("VTW00902")) {
            updateData.put("ftnessTrngCtClmAmt", (int)shResult.get("ftnessTrngCtClmAmt") - (int)param.get("clmAmt"));
        }
        updateData.put("clmAmt", (int)shResult.get("clmAmt") - (int)param.get("clmAmt"));

        List<Map<String, Object>> updateParam = new ArrayList<>();
        updateParam.add(tbNm);
        updateParam.add(updateData);
        updateParam.add(data);
        int result = commonService.updateData(updateParam);

        return result;
    }

    public static int editClturPhstrnActCt (Map<String, Object> param){
        Map<String, Object> tbNm = new HashMap<>();
        tbNm.put("tbNm", "CLTUR_PHSTRN_ACT_CT");

        Map<String, Object> data = new HashMap<>();
        data.put("empId", param.get("empId"));
        data.put("clmYm", param.get("clmYmd").toString().substring(0,6));

        List<Map<String, Object>> searchParam = new ArrayList<>();
        searchParam.add(tbNm);
        searchParam.add(data);
        List<Map<String, Object>> search = commonService.commonSelect(searchParam);

        Map<String, Object> shResult= search.get(0);
        Map<String, Object> updateData = new HashMap<>();
        if(param.get("clturPhstrnSeCd").equals("VTW00901")){
            updateData.put("clturCtClmAmt", (int)shResult.get("clturCtClmAmt") - (int)param.get("selectedClmAmt") + (int)param.get("clmAmt"));
        } else if (param.get("clturPhstrnSeCd").equals("VTW00902")) {
            updateData.put("ftnessTrngCtClmAmt", (int)shResult.get("ftnessTrngCtClmAmt") - (int)param.get("selectedClmAmt") + (int)param.get("clmAmt"));
        }
        updateData.put("clmAmt", (int)shResult.get("clmAmt") - (int)param.get("selectedClmAmt") + (int)param.get("clmAmt"));

        List<Map<String, Object>> updateParam = new ArrayList<>();
        updateParam.add(tbNm);
        updateParam.add(updateData);
        updateParam.add(data);
        int result = commonService.updateData(updateParam);

        return result;
    }

    public static List<Map<String, Object>> retrieveClturPhstrnActCt (Map<String, Object> param){

        List<Map<String, Object>> data = new ArrayList<>();

        // 체력단련비 청구
        Map<String, Object> paramFtClm = new HashMap<>();
        paramFtClm.put("queryId", "indvdlClmMapper.retrieveFtnessTrngCtClmAmt");
        paramFtClm.put("empId", param.get("empId"));
        paramFtClm.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultFtClm = commonService.queryIdSearch(paramFtClm);
        data.addAll(resultFtClm);
        // 체력단련비 지급
        Map<String, Object> paramFtDpst = new HashMap<>();
        paramFtDpst.put("queryId", "indvdlClmMapper.retrieveFtnessTrngCtDpstAmt");
        paramFtDpst.put("empId", param.get("empId"));
        paramFtDpst.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultFtDpst = commonService.queryIdSearch(paramFtDpst);
        data.addAll(resultFtDpst);
        // 체력단련비 지급날짜
        Map<String, Object> paramFtDpstYmd = new HashMap<>();
        paramFtDpstYmd.put("queryId", "indvdlClmMapper.retrieveFtnessTrngCtDpstYmd");
        paramFtDpstYmd.put("empId", param.get("empId"));
        paramFtDpstYmd.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultFtDpstYmd = commonService.queryIdSearch(paramFtDpstYmd);
        data.addAll(resultFtDpstYmd);
        // 체력단련비 잔액
        Map<String, Object> paramFtCyfd = new HashMap<>();
        paramFtCyfd.put("queryId", "indvdlClmMapper.retrieveFtnessTrngCtCyfdAmt");
        paramFtCyfd.put("empId", param.get("empId"));
        paramFtCyfd.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultFtCyfd = commonService.queryIdSearch(paramFtCyfd);
        data.addAll(resultFtCyfd);
        // 문화비 청구
        Map<String, Object> paramClturClm = new HashMap<>();
        paramClturClm.put("queryId", "indvdlClmMapper.retrieveClturCtClmAmt");
        paramClturClm.put("empId", param.get("empId"));
        paramClturClm.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultClturClm = commonService.queryIdSearch(paramClturClm);
        data.addAll(resultClturClm);
        // 문화비 지급
        Map<String, Object> paramClturDpst = new HashMap<>();
        paramClturDpst.put("queryId", "indvdlClmMapper.retrieveClturCtDpstAmt");
        paramClturDpst.put("empId", param.get("empId"));
        paramClturDpst.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultClturDpst = commonService.queryIdSearch(paramClturDpst);
        data.addAll(resultClturDpst);
        // 문화비 지급날짜
        Map<String, Object> paramClturDpstYmd = new HashMap<>();
        paramClturDpstYmd.put("queryId", "indvdlClmMapper.retrieveClturCtDpstYmd");
        paramClturDpstYmd.put("empId", param.get("empId"));
        paramClturDpstYmd.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultClturDpstYmd = commonService.queryIdSearch(paramClturDpstYmd);
        data.addAll(resultClturDpstYmd);
        // 문화비 잔액
        Map<String, Object> paramClturCyfd = new HashMap<>();
        paramClturCyfd.put("queryId", "indvdlClmMapper.retrieveClturCtCyfdAmt");
        paramClturCyfd.put("empId", param.get("empId"));
        paramClturCyfd.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultClturCyfd = commonService.queryIdSearch(paramClturCyfd);
        data.addAll(resultClturCyfd);
        // 전체 청구 합계
        Map<String, Object> paramClm = new HashMap<>();
        paramClm.put("queryId", "indvdlClmMapper.retrieveClmAmt");
        paramClm.put("empId", param.get("empId"));
        paramClm.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultClm = commonService.queryIdSearch(paramClm);
        data.addAll(resultClm);
        // 전체 지급 합계
        Map<String, Object> paramDpst = new HashMap<>();
        paramDpst.put("queryId", "indvdlClmMapper.retrieveDpstAmt");
        paramDpst.put("empId", param.get("empId"));
        paramDpst.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultDpst = commonService.queryIdSearch(paramDpst);
        data.addAll(resultDpst);
        // 전체 잔액 합계
        Map<String, Object> paramCyfd = new HashMap<>();
        paramCyfd.put("queryId", "indvdlClmMapper.retrieveCyfdAmt");
        paramCyfd.put("empId", param.get("empId"));
        paramCyfd.put("clmYm", param.get("clmYm"));
        List<Map<String, Object>> resultCyfd = commonService.queryIdSearch(paramCyfd);
        data.addAll(resultCyfd);

        return data;
    }
}
