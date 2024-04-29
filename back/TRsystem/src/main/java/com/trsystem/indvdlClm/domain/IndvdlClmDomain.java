package com.trsystem.indvdlClm.domain;

import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trsystem.common.service.CommonService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
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

//    public static List<Map<String, Object>> insertPrjctMmAply(List<Map<String, Object>> params){
//        int result;
////
////        for(int i = 0; i < deleteParams.size(); i++){
////            Map<String, Object> deletePrjctMmAtrzStateMap = new HashMap<>();
////            deletePrjctMmAtrzStateMap = deleteParams.get(i);
////            deletePrjctMmAtrzStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzDel");
////            List<Map<String, Object>> deletePrjctMmAtrzState = commonService.queryIdSearch(deletePrjctMmAtrzStateMap);
////
////            Map<String, Object> deletePrjctMmAplyStateMap = new HashMap<>();
////            deletePrjctMmAplyStateMap = deleteParams.get(i);
////            deletePrjctMmAplyStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyDel");
////            List<Map<String, Object>> deletePrjctMmAplyState = commonService.queryIdSearch(deletePrjctMmAplyStateMap);
////        }
//
////        if(params.size() > 0){
////            // 승인요청취소상태 및 반려상태 데이터 조회
////            Map<String, Object> selectPrjctMmAtrzStateMap = new HashMap<>();
////            selectPrjctMmAtrzStateMap = params.get(0);
////            selectPrjctMmAtrzStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzRtrcn");
////            List<Map<String, Object>> selectPrjctMmAtrzState = commonService.queryIdSearch(selectPrjctMmAtrzStateMap);
////
////            for(int i = 0 ; i < selectPrjctMmAtrzState.size(); i++){
////                Map<String, Object> deletePrjctMmAtrzStateMap = new HashMap<>();
////                deletePrjctMmAtrzStateMap = params.get(i);
////                deletePrjctMmAtrzStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzDel");
////                List<Map<String, Object>> deletePrjctMmAtrzState = commonService.queryIdSearch(deletePrjctMmAtrzStateMap);
////
////                Map<String, Object> deletePrjctMmAplyStateMap = new HashMap<>();
////                deletePrjctMmAplyStateMap = params.get(i);
////                deletePrjctMmAplyStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyDel");
////                List<Map<String, Object>> deletePrjctMmAplyState = commonService.queryIdSearch(deletePrjctMmAplyStateMap);
////            }
////        }
//
//        for (int i = 0; i < params.size(); i++){
//            // PRJCT_MM_ATRZ(프로젝트MM결재) 기존 데이터 삭제
//            Map<String, Object> deletePrjctMmAtrzMap = new HashMap<>();
//            deletePrjctMmAtrzMap = params.get(i);
//
//            if(!deletePrjctMmAtrzMap.get("atrzDmndSttsCd").equals("VTW03703")){
//                deletePrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzDel");
//                List<Map<String, Object>> deletePrjctMmAtrzData = commonService.queryIdSearch(deletePrjctMmAtrzMap);
//            }
//
//            // PRJCT_MM_APLY(프로젝트MM신청) 기존 데이터 삭제
//            Map<String, Object> deletePrjctMmAplyMap = new HashMap<>();
//            deletePrjctMmAplyMap = params.get(i);
//            if(!deletePrjctMmAplyMap.get("atrzDmndSttsCd").equals("VTW03703")) {
//                deletePrjctMmAplyMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyDel");
//                List<Map<String, Object>> deletePrjctMmAplyData = commonService.queryIdSearch(deletePrjctMmAplyMap);
//            }
//        }
//
//
//        List<Map<String, Object>> insertMap = new ArrayList<>();
//        for(int i = 0; i < params.size(); i++){
//            params.get(i).put("tbNm", "PRJCT_INDVDL_CT_MM");
//            insertMap.add(params.get(i));
//
//            // PRJCT_INDVDL_CT_MM(프로젝트개인비용MM) INSERT/UPDATE
//            Map<String, Object> mergePrjctIndvdlCtMmMap = new HashMap<>();
//            mergePrjctIndvdlCtMmMap = params.get(i);
//            mergePrjctIndvdlCtMmMap.put("queryId", "indvdlClmMapper.retrievePrjctIndvdlCtMmStrg");
//            List<Map<String, Object>> mergePrjctIndvdlCtMmData = commonService.queryIdSearch(mergePrjctIndvdlCtMmMap);
//
//            Map<String, Object> insertPrjctMmAplyMap = new HashMap<>();
//            insertPrjctMmAplyMap = params.get(i);
//            if(!insertPrjctMmAplyMap.get("atrzDmndSttsCd").equals("VTW03703")) {
//                insertPrjctMmAplyMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyStrg");
//                List<Map<String, Object>> insertPrjctMmAplyResult = commonService.queryIdSearch(insertPrjctMmAplyMap);
//            }
//
//            Map<String, Object> insertPrjctMmAtrzMap = new HashMap<>();
//            insertPrjctMmAtrzMap = params.get(i);
//            if(!insertPrjctMmAtrzMap.get("atrzDmndSttsCd").equals("VTW03703")) {
//                insertPrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzStrg");
//                List<Map<String, Object>> insertPrjctMmAtrzResult = commonService.queryIdSearch(insertPrjctMmAtrzMap);
//            }
//        }
//
////        System.out.println("======================================");
////        System.out.println("insertMap" + insertMap);
////        System.out.println("======================================");
//
////        result = commonService.insertDataList(insertMap);
//
//        System.out.println("======================================");
////        System.out.println("result" + result);
//        System.out.println("======================================");
//
//        return null;
//    }
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

//        if(params.size() > 0){
//            // 승인요청취소상태 및 반려상태 데이터 조회
//            Map<String, Object> selectPrjctMmAtrzStateMap = new HashMap<>();
//            selectPrjctMmAtrzStateMap = params.get(0);
//            selectPrjctMmAtrzStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzRtrcn");
//            List<Map<String, Object>> selectPrjctMmAtrzState = commonService.queryIdSearch(selectPrjctMmAtrzStateMap);
//
//            for(int i = 0 ; i < selectPrjctMmAtrzState.size(); i++){
//                Map<String, Object> deletePrjctMmAtrzStateMap = new HashMap<>();
//                deletePrjctMmAtrzStateMap = params.get(i);
//                deletePrjctMmAtrzStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzDel");
//                List<Map<String, Object>> deletePrjctMmAtrzState = commonService.queryIdSearch(deletePrjctMmAtrzStateMap);
//
//                Map<String, Object> deletePrjctMmAplyStateMap = new HashMap<>();
//                deletePrjctMmAplyStateMap = params.get(i);
//                deletePrjctMmAplyStateMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyDel");
//                List<Map<String, Object>> deletePrjctMmAplyState = commonService.queryIdSearch(deletePrjctMmAplyStateMap);
//            }
//        }

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
            if(!insertPrjctMmAplyMap.get("atrzDmndSttsCd").equals("VTW03703")) {
                insertPrjctMmAplyMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAplyStrg");
                List<Map<String, Object>> insertPrjctMmAplyResult = commonService.queryIdSearch(insertPrjctMmAplyMap);
            }

            Map<String, Object> insertPrjctMmAtrzMap = new HashMap<>();
            insertPrjctMmAtrzMap = params.get(i);
            if(!insertPrjctMmAtrzMap.get("atrzDmndSttsCd").equals("VTW03703")) {
                insertPrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmAtrzStrg");
                List<Map<String, Object>> insertPrjctMmAtrzResult = commonService.queryIdSearch(insertPrjctMmAtrzMap);
            }
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
            Map<String, Object> elctrnAtrzId,           // 전자결재ID
            Map<String, Object> elctrnTbMap,            // ELCTRN_ATRZ
            Map<String, Object> insertElctrnMap,        // ELCTRN_ATRZ
            Map<String, Object> vcatnTbMap,             // VCATN_ATRZ
            Map<String, Object> insertVcatnMap,         // VCATN_ATRZ
            Map<String, Object> atrzLnTbMap,            // ATRZ_LN
            List<Map<String, Object>> insertAtrzLnMap,  // ATRZ_LN
            Map<String, Object> refrnTbMap,             // REFRN_MAN
            List<Map<String, Object>> insertRefrnMap,   // REFRN_MAN
            List<MultipartFile> attachments)
    {
        int result = 0;
        String elctrnAtrzValue = (String) elctrnAtrzId.get("elctrnAtrzId");

        final String sortKey = "approvalCode";
        Collections.sort(insertAtrzLnMap, new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> map1, Map<String, Object> map2) {
                Comparable value1 = (Comparable) map1.get(sortKey);
                Comparable value2 = (Comparable) map2.get(sortKey);
                return value1.compareTo(value2);
            }
        });

        System.out.println("=======================================");
        System.out.println("insertAtrzLnMap : " + insertAtrzLnMap);
        System.out.println("=======================================");

        // ELCTRN_ATRZ(전자결재) 테이블 저장
        List<Map<String, Object>> insertElctrnList = new ArrayList<>();
        insertElctrnMap.put("elctrnAtrzId", elctrnAtrzValue);
        insertElctrnMap.put("atrzFormDocId", "9632d577-f0bd-11ee-9b25-000c2956283f");
        insertElctrnMap.put("nowAtrzLnSn", "1");
        insertElctrnList.add(0, elctrnTbMap);
        insertElctrnList.add(1, insertElctrnMap);
        result = commonService.insertData(insertElctrnList);

        // VCATN_ATRZ(휴가결재), ATCHMNFL(첨부파일) 테이블 저장
        insertVcatnMap.put("elctrnAtrzId", elctrnAtrzValue);
        result = commonService.insertFile(vcatnTbMap, insertVcatnMap, attachments, null, null);


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
        result = commonService.insertData(insertAtrzLnList);

        // REFRN_MAN(결재선) 저장
        List<Map<String, Object>> insertRefrnManList = new ArrayList<>();
        insertRefrnManList.add(0, refrnTbMap);
        for (int i = 0 ; i < insertRefrnMap.size(); i++){
            insertRefrnMap.get(i).put("elctrnAtrzId", elctrnAtrzValue);
            insertRefrnMap.get(i).put("refrnCncrrncClCd", insertRefrnMap.get(i).get("approvalCode"));
            insertRefrnMap.get(i).put("ccSn", i + 1);
            insertRefrnManList.add(i + 1, insertRefrnMap.get(i));
        }
        result = commonService.insertData(insertRefrnManList);
















        // 2024_04_04
        // 회의 이후 작업

        // VCATN_MNG(휴가관리) 회계_신규 휴가일수 정합성 확인
        Map<String, Object> retrieveVcatnStrgInfoMap = new HashMap<>();
        retrieveVcatnStrgInfoMap = insertVcatnMap;
        retrieveVcatnStrgInfoMap.put("queryId", "indvdlClmMapper.retrieveVcatnStrgInfoInq");
        List<Map<String, Object>> retrieveVcatnStrgInfoResult = commonService.queryIdSearch(retrieveVcatnStrgInfoMap);

//        System.out.println("=====================================");
//        System.out.println("retrieveVcatnStrgInfoResult : " + retrieveVcatnStrgInfoResult);
//        System.out.println("=====================================");

        /**
         * caseFlag
         * 서버처리
         * 1) 신규배정휴가가 존재하고 휴가사용일수가 신규배정휴가안에서 사용가능한 경우
         * 2) 신규배정휴가가 존재하고 휴가사용일수가 신규배정휴가안에서 사용불가능하지만 회계배정휴가가 존재하여 회계배정휴가와 함께 사용하는 경우
         * 3) 신규배정휴가가 존재하고 휴가사용일수가 신규배정휴가안에서 사용불가능하며 회계배정휴가가 존재하지 않는 경우
         * 4) 신규배정휴가가 존재하지않고 회계배정휴가가 존재하며 회계배정휴가안에서 사용가능한 경우
         * 5) 신규배정휴가가 존재하지않고 회계배정휴가가 존재하며 회계배정휴가안에서 사용불가능한 경우
         * 6) 신규배정휴가가 존재하지않고 회계배정휴가도 존재하지 않는 경우
         *
         * 화면처리
         * 1) 현재 회계년도가 아닌 다른회계년도 휴가 신청하는 경우
         * 2) 현재 회계년도가 아니지만 신규배정휴가기간 휴가 신청하는 경우
         * 3) 현재날짜의 이전날짜에 휴가 신청하는 경우
         * 4) 휴가등록기간 불가능 기간에 신청하는 경우
         * 5) 휴가종료일자이후 휴가취소하는 경우
         */
        String caseFlag;
        Map<String, Object> refNewVcatnMngMap = new HashMap<>();
        Map<String, Object> refVcatnMngMap= new HashMap<>();

        for (int i = 0; i < retrieveVcatnStrgInfoResult.size(); i++){
            if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("NEW") > -1){
                refNewVcatnMngMap = retrieveVcatnStrgInfoResult.get(i);
            } else if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("ACCOUNT") > -1){
                refVcatnMngMap = retrieveVcatnStrgInfoResult.get(i);
            }
        }

        Map<String, Object> insertNewVcatnMngMap = new HashMap<>();
        Map<String, Object> insertVcatnMngMap = new HashMap<>();
        for (int i = 0; i < retrieveVcatnStrgInfoResult.size(); i++){
            if(retrieveVcatnStrgInfoResult.get(i).toString().indexOf("NEW") > -1){
                double newRemCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newRemndrDaycnt")));           // 신규기준잔여일수
                double newUseCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newUseDaycnt")));              // 신규기존사용일수
                double newAddUseCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoMap.get("vcatnDeCnt")));                       // 신규기준추가사용일수
                double newTotalCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(i).get("newVcatnAltmntDaycnt")));    // 신규기준휴가배정일수
                double overUseCnt;

                if(newUseCnt + newAddUseCnt <= newTotalCnt){
                    insertNewVcatnMngMap.put("vcatnAltmntSn", retrieveVcatnStrgInfoResult.get(i).get("vcatnAltmntSn"));
                    insertNewVcatnMngMap.put("empId", retrieveVcatnStrgInfoResult.get(i).get("empId"));
                    insertNewVcatnMngMap.put("vcatnYr", retrieveVcatnStrgInfoResult.get(i).get("vcatnYr"));
                    insertNewVcatnMngMap.put("useDaycnt", retrieveVcatnStrgInfoResult.get(i).get("useDaycnt"));
                    insertNewVcatnMngMap.put("vcatnRemndrDaycnt", retrieveVcatnStrgInfoResult.get(i).get("vcatnRemndrDaycnt"));
                    insertNewVcatnMngMap.put("newUseDaycnt", newUseCnt + newAddUseCnt);
                    insertNewVcatnMngMap.put("newRemndrDaycnt", newTotalCnt - newUseCnt - newAddUseCnt);
                    insertNewVcatnMngMap.put("mdfcnEmpId", retrieveVcatnStrgInfoMap.get("empId"));
                } else if(newUseCnt + newAddUseCnt > newTotalCnt){
                    overUseCnt = newRemCnt + newAddUseCnt - newTotalCnt;
                    insertNewVcatnMngMap.put("vcatnAltmntSn", retrieveVcatnStrgInfoResult.get(i).get("vcatnAltmntSn"));
                    insertNewVcatnMngMap.put("empId", retrieveVcatnStrgInfoResult.get(i).get("empId"));
                    insertNewVcatnMngMap.put("vcatnYr", retrieveVcatnStrgInfoResult.get(i).get("vcatnYr"));
                    insertNewVcatnMngMap.put("useDaycnt", retrieveVcatnStrgInfoResult.get(i).get("useDaycnt"));
                    insertNewVcatnMngMap.put("vcatnRemndrDaycnt", retrieveVcatnStrgInfoResult.get(i).get("vcatnRemndrDaycnt"));
                    insertNewVcatnMngMap.put("newUseDaycnt", newTotalCnt);
                    insertNewVcatnMngMap.put("newRemndrDaycnt", 0);
                    insertNewVcatnMngMap.put("mdfcnEmpId", retrieveVcatnStrgInfoMap.get("empId"));

                    for (int j = 0; j < retrieveVcatnStrgInfoResult.size(); j++){
                        if(retrieveVcatnStrgInfoResult.get(j).toString().indexOf("ACCOUNT") > -1){
                            double remCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(j).get("vcatnRemndrDaycnt")));        // 회계기준잔여일수
                            double useCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(j).get("useDaycnt")));                // 회계기준사용일수
                            double totalCnt = Double.parseDouble(String.valueOf(retrieveVcatnStrgInfoResult.get(j).get("vcatnAltmntDaycnt")));      // 회계기준휴가배정일수

                            insertVcatnMngMap.put("vcatnAltmntSn", retrieveVcatnStrgInfoResult.get(j).get("vcatnAltmntSn"));
                            insertVcatnMngMap.put("empId", retrieveVcatnStrgInfoResult.get(j).get("empId"));
                            insertVcatnMngMap.put("vcatnYr", retrieveVcatnStrgInfoResult.get(j).get("vcatnYr"));
                            insertVcatnMngMap.put("useDaycnt", useCnt - overUseCnt);
                            insertVcatnMngMap.put("vcatnRemndrDaycnt", totalCnt - remCnt + overUseCnt);
                            insertVcatnMngMap.put("newUseDaycnt", retrieveVcatnStrgInfoResult.get(j).get("newUseDaycnt"));
                            insertVcatnMngMap.put("newRemndrDaycnt", retrieveVcatnStrgInfoResult.get(j).get("newRemndrDaycnt"));
                            insertVcatnMngMap.put("mdfcnEmpId", retrieveVcatnStrgInfoMap.get("empId"));
                        } else {
                            System.out.println("============================================");
                            System.out.println("회계기준휴가 없으면서 신규휴가 넘어서 사용");
                            System.out.println("============================================");
                        }
                    }
                }
            } else {
            }
        }

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

        return result;

    }

    public static List<Map<String, Object>> updatePrjctMmAply(List<Map<String, Object>> params){
        int result;

        System.out.println("=============================");
        System.out.println("params : " + params);
        System.out.println("=============================");

        for(int i = 0; i < params.size(); i++){
            Map<String, Object> updatePrjctMmAtrzMap = new HashMap<>();
            updatePrjctMmAtrzMap = params.get(i);
            updatePrjctMmAtrzMap.put("queryId", "indvdlClmMapper.retrievePrjctMmSttsInq");
            List<Map<String, Object>> updatePrjctMmAtrzResult = commonService.queryIdSearch(updatePrjctMmAtrzMap);
        }

        return null;
    }
}
