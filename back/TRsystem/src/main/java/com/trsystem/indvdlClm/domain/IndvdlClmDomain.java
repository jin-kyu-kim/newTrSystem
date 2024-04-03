package com.trsystem.indvdlClm.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trsystem.common.service.CommonService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

@Data
@NoArgsConstructor
@Component
public class IndvdlClmDomain {
    private static CommonService commonService;

    @Autowired
    public IndvdlClmDomain(CommonService commonService){
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

    public static List<Map<String, Object>> insertPrjctMmAply(List<Map<String, Object>> params){
        int result;
        if(params.size() > 0){
            // PRJCT_MM_ATRZ(프로젝트MM결재) 기존 데이터 삭제
            Map<String, Object> deletePrjctMmAtrzMap = new HashMap<>();
            deletePrjctMmAtrzMap = params.get(0);
            deletePrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzDel");
            List<Map<String, Object>> deletePrjctMmAtrzData = commonService.queryIdSearch(deletePrjctMmAtrzMap);

            // PRJCT_MM_APLY(프로젝트MM신청) 기존 데이터 삭제
            Map<String, Object> deletePrjctMmAplyMap = new HashMap<>();
            deletePrjctMmAplyMap = params.get(0);
            deletePrjctMmAplyMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyDel");
            List<Map<String, Object>> deletePrjctMmAplyData = commonService.queryIdSearch(deletePrjctMmAplyMap);
        }


        List<Map<String, Object>> insertMap = new ArrayList<>();
        for(int i = 0; i < params.size(); i++){
            params.get(i).put("tbNm", "PRJCT_INDVDL_CT_MM");
            insertMap.add(params.get(i));

            // PRJCT_INDVDL_CT_MM(프로젝트개인비용MM) INSERT/UPDATE
            Map<String, Object> mergePrjctIndvdlCtMmMap = new HashMap<>();
            mergePrjctIndvdlCtMmMap = params.get(i);
            mergePrjctIndvdlCtMmMap.put("queryId", "indvdlClmMapper.retrievePrjctIndvdlCtMmStrg");
            List<Map<String, Object>> mergePrjctIndvdlCtMmData = commonService.queryIdSearch(mergePrjctIndvdlCtMmMap);

            Map<String, Object> insertPrjctMmAplyMap = new HashMap<>();
            insertPrjctMmAplyMap = params.get(i);
            insertPrjctMmAplyMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyStrg");
            List<Map<String, Object>> insertPrjctMmAplyResult = commonService.queryIdSearch(insertPrjctMmAplyMap);

            Map<String, Object> insertPrjctMmAtrzMap = new HashMap<>();
            insertPrjctMmAtrzMap = params.get(i);
            insertPrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzStrg");
            List<Map<String, Object>> insertPrjctMmAtrzResult = commonService.queryIdSearch(insertPrjctMmAtrzMap);
        }

//        System.out.println("======================================");
//        System.out.println("insertMap" + insertMap);
//        System.out.println("======================================");

//        result = commonService.insertDataList(insertMap);

        System.out.println("======================================");
//        System.out.println("result" + result);
        System.out.println("======================================");

        return null;
    }

    // 휴가결재저장
    @Transactional
    public static int insertVcatnAtrz(
            Map<String, Object> elctrnTbMap,
            Map<String, Object> insertElctrnMap,
            Map<String, Object> vcatnTbMap,
            Map<String, Object> insertVcatnMap,
            List<MultipartFile> attachments)
    {
        int result = 0;

        // ELCTRN_ATRZ(전자결재) 테이블 저장
        List<Map<String, Object>> insertVcatnAtrzMap = new ArrayList<>();
        insertVcatnAtrzMap.add(0, elctrnTbMap);
        insertVcatnAtrzMap.add(1, insertElctrnMap);
        result = commonService.insertData(insertVcatnAtrzMap);

        // VCATN_ATRZ(휴가결재), ATCHMNFL(첨부파일) 테이블 저장
        result = commonService.insertFile(vcatnTbMap, insertVcatnMap, attachments, null, null);

        // VCATN_MNG(휴가관리) 회계_신규 휴가일수 정합성 확인
        Map<String, Object> retrieveVcatnStrgInfoMap = new HashMap<>();
        retrieveVcatnStrgInfoMap = insertVcatnMap;
        retrieveVcatnStrgInfoMap.put("queryId", "indvdlClmMapper.retrieveVcatnStrgInfoInq");
        List<Map<String, Object>> retrieveVcatnStrgInfoResult = commonService.queryIdSearch(retrieveVcatnStrgInfoMap);

        System.out.println("=====================================");
        System.out.println("retrieveVcatnStrgInfoResult : " + retrieveVcatnStrgInfoResult);
        System.out.println("=====================================");

        Map<String, Object> insertNewVcatnMngMap = new HashMap<>();
        Map<String, Object> insertVcatnMngMap = new HashMap<>();
        for (int i = 0; i < retrieveVcatnStrgInfoResult.size(); i++){
            if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("NEW") > -1){
                double remCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newRemndrDaycnt")));           // 신규잔여일수
                double useCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newUseDaycnt")));              // 기존사용일수
                double newUseCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoMap.get("vcatnDeCnt")));                       // 추가사용일수
                double totalCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newVcatnAltmntDaycnt")));    // 신규휴가배정일수
                if(remCnt + newUseCnt <= totalCnt){
                    insertNewVcatnMngMap.put("vcatnAltmntSn", retrieveVcatnStrgInfoResult.get(i).get("vcatnAltmntSn"));
                    insertNewVcatnMngMap.put("empId", retrieveVcatnStrgInfoResult.get(i).get("empId"));
                    insertNewVcatnMngMap.put("vactnYr", retrieveVcatnStrgInfoResult.get(i).get("vactnYr"));
                    insertNewVcatnMngMap.put("newUseDaycnt", useCnt + newUseCnt);
                    insertNewVcatnMngMap.put("newRemndrDaycnt", totalCnt - useCnt - newUseCnt);
                    insertNewVcatnMngMap.put("mdfcnEmpId", retrieveVcatnStrgInfoMap.get("empId"));
                } else if(remCnt + newUseCnt > totalCnt){
                    insertNewVcatnMngMap.put("vcatnAltmntSn", retrieveVcatnStrgInfoResult.get(i).get("vcatnAltmntSn"));
                    insertNewVcatnMngMap.put("empId", retrieveVcatnStrgInfoResult.get(i).get("empId"));
                    insertNewVcatnMngMap.put("vactnYr", retrieveVcatnStrgInfoResult.get(i).get("vactnYr"));
                    insertNewVcatnMngMap.put("newUseDaycnt", useCnt + newUseCnt);
                    insertNewVcatnMngMap.put("newRemndrDaycnt", totalCnt - useCnt - newUseCnt);
                    insertNewVcatnMngMap.put("mdfcnEmpId", retrieveVcatnStrgInfoMap.get("empId"));
                }
            }
        }

        System.out.println("=====================================");
        System.out.println("입사기준휴가");
        System.out.println("insertNewVcatnMngMap : " + insertNewVcatnMngMap);
        System.out.println("=====================================");

        System.out.println("=====================================");
        System.out.println("회계기준휴가");
        System.out.println("insertVcatnMngMap : " + insertVcatnMngMap);
        System.out.println("=====================================");

        insertVcatnMap.put("state", "UPDATE");
//        result = commonService.queryIdDataControl(insertVcatnMap);


//        commonService.queryIdDataControl(param);
//        commonService.queryIdDataControl(param);
//        commonService.queryIdDataControl(param);

        return result;

    }
}
