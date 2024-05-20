package com.trsystem.elecAtrz.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.trsystem.common.service.CommonService;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Component
public class ElecAtrzDomain {

    private static CommonService commonService;

    @Autowired
    public ElecAtrzDomain(CommonService commonService) {
        ElecAtrzDomain.commonService = commonService;
    }

    /**
     * 전자결재 저장 메소드
     *
     * @param params
     * @return
     */
    @Transactional
    public static String insertElecAtrz(Map<String, Object> params) {

        // 공통
        String regDt = String.valueOf(params.get("regDt"));
        String regEmpId = String.valueOf(params.get("regEmpId"));
        String atrzTySeCd = String.valueOf(params.get("elctrnAtrzTySeCd"));
        String elctrnAtrzId = String.valueOf(params.get("elctrnAtrzId"));
        String atrzDmndSttsCd = String.valueOf(params.get("atrzDmndSttsCd"));


        Map<String, String> basicInfo = new HashMap<>();
        basicInfo.put("regDt", regDt);
        basicInfo.put("regEmpId", regEmpId);
        basicInfo.put("elctrnAtrzId", elctrnAtrzId);

        Map<String, Object> elecAtrzParam = new HashMap<>();
        Map<String, Object> tbParam = new HashMap<>();


        int electrnAtrzResult = -1;
        int atrzLnResult = -1;
        int atrzTyResult = -1;

        try {
            deleteTempAtrz(atrzDmndSttsCd, elctrnAtrzId);

            // 전자결재 테이블에 insert 한다.
            elecAtrzParam.putAll(params);
            elecAtrzParam.put("nowAtrzLnSn", 1);
            elecAtrzParam.put("atrzDmndEmpId", regEmpId);

            // 문서번호 만들기
            List<Map<String, Object>> list = new ArrayList<>();
            Map<String, Object> countMap = new HashMap<>();
            countMap.put("queryId", "elecAtrzMapper.retrieveCntElctrnAtrz");
            list = commonService.queryIdSearch(countMap);

            int cnt = Integer.parseInt(String.valueOf(list.get(0).get("cnt")));

            String elctrnAtrzDocNo = regDt.substring(0, 4) + "-" + atrzTySeCd.substring(atrzTySeCd.length() - 2, atrzTySeCd.length()) + "-" + (cnt + 1);
            elecAtrzParam.put("elctrnAtrzDocNo", elctrnAtrzDocNo);

            elecAtrzParam.remove("param");

            System.out.println(elecAtrzParam);
            List<Map<String, Object>> insertParams = new ArrayList<>();

            tbParam.put("tbNm", "ELCTRN_ATRZ");

            insertParams.add(0, tbParam);
            insertParams.add(elecAtrzParam);

            electrnAtrzResult = commonService.insertData(insertParams);
//			}
			if(electrnAtrzResult > 0) {
				
				// 전자결재 결재선 데이터 입력
				atrzLnResult = insertAtrzLine((List<Map<String, Object>>)params.get("atrzLnEmpList"), basicInfo);
				
				if(atrzTySeCd.equals("VTW04908") || atrzTySeCd.equals("VTW04909") || atrzTySeCd.equals("VTW04910")) {
					
					Map<String, Object> map = new HashMap<>();
					
					map.putAll(((Map<String, Object>) params.get("param")));
					
					// 계약결재 데이터 입력
					atrzTyResult = insertCtrtAtrz(map, atrzTySeCd, elctrnAtrzId);
					
				} else if(atrzTySeCd.equals("VTW04907")) {
					Map<String, Object> map = new HashMap<>();
					
					map.putAll(((Map<String, Object>) params.get("param")));
					atrzTyResult = insertClmAtrz(map, elctrnAtrzId);
				} else if(atrzTySeCd.equals("VTW04911") || atrzTySeCd.equals("VTW04912") || atrzTySeCd.equals("VTW04913") || atrzTySeCd.equals("VTW04914")) {
					
					// 청구결재(지급품의) INSERT 로직 추가
					Map<String, Object> map = new HashMap<>();
					
					map.putAll(((Map<String, Object>) params.get("param")));
					
					atrzTyResult = insertGiveAtrz(map, elctrnAtrzId); 
							
				} else {
					/**
					 * ToDo: 일반 결재
					 */
					Map<String, Object> map = new HashMap<>();
					
					map.putAll(((Map<String, Object>) params.get("param")));
					
					atrzTyResult = insertGnrlAtrz(map, elctrnAtrzId); 
				}
				
				if(electrnAtrzResult < 0 || atrzTyResult < 0 || atrzLnResult < 0) return null;
				
			}
			
			
		} catch (Exception e) {
			return null;
		}

		
		return elctrnAtrzId;
	}
	
	/**
	 * target이 되는 테이블 명과 전자결재 아이디를 받아서 데이터를 지운다
	 * @param tbNm
	 * @param elctrnAtrzId
	 * @return
	 */
	public static int deleteData(String tbNm, String elctrnAtrzId) {
		int result = 0;
		
		Map<String, Object> tbParam = new HashMap<>();
		Map<String, Object> conditionParam = new HashMap<>();
		tbParam.put("tbNm", tbNm);
		conditionParam.put("elctrnAtrzId", elctrnAtrzId);
		
		ArrayList<Map<String, Object>> deleteParams = new ArrayList<>();
		deleteParams.add(0, tbParam);
		deleteParams.add(1, conditionParam);
		
		result = commonService.deleteData(deleteParams);
		return result;
	}
  
  
  public static int deleteTempAtrz(String atrzTySeCd, String elctrnAtrzId) {
        // 기존에 저장된 전자결재 아이디에 해당하는 값을 제거한다.
        int result = 0;

        // 1. 결재선 지우기
        deleteData("ATRZ_LN", elctrnAtrzId);

        // 2. 참조/합의 결재선 지우기
        deleteData("REFRN_MAN", elctrnAtrzId);

        // 계약결재
        if (atrzTySeCd.equals("VTW04908") || atrzTySeCd.equals("VTW04909") || atrzTySeCd.equals("VTW04910")) {
            // delete 계약결재와 관련된 테이블 slave -> master
            // 업체와 인력 나눠서 delete 하는 메소드 다르게 진행

            if (atrzTySeCd.equals("VTW04909") || atrzTySeCd.equals("VTW04910")) {
                // 업체 관련(재료비, 외주업체), target: ENTRPS_CTRT_DTL, ENTRPS_CTRT_DTL_CND
                deleteData("ENTRPS_CTRT_DTL_CND", elctrnAtrzId);
                deleteData("ENTRPS_CTRT_DTL", elctrnAtrzId);

            } else if (atrzTySeCd.equals("VTW04908")) {
                // 외주인력 관련(외주인력), target: HNF_CTRT_DTL, HNF_CTRT_DTL_CND
                deleteData("HNF_CTRT_DTL_MM", elctrnAtrzId);
                deleteData("HNF_CTRT_DTL", elctrnAtrzId);
            }

            // 계약결재 테이블 제거, target: CTRT_ATRZ
            deleteData("CTRT_ATRZ", elctrnAtrzId);

        } else if (atrzTySeCd.equals("VTW04907")) {
            // delete 청구결재와 관련된 내용 slave -> master, target: CLM_ATRZ, CLM_ATRZ_DTL
            deleteData("CLM_ATRZ_DTL", elctrnAtrzId);
            deleteData("CLM_ATRZ", elctrnAtrzId);

        } else if (atrzTySeCd.equals("VTW04914")) {
            // 계약청구(지급품의), target : CTRT_GIVE_ATRZ
            deleteData("CTRT_GIVE_ATRZ", elctrnAtrzId);
        }
        // 전자결재 테이블 데이터 삭제(최상위)
        result += deleteData("ELCTRN_ATRZ", elctrnAtrzId);
        return result;
    }
	
	/**
	 * 
	 * @param paramList
	 * @param basicInfo	기초 정보(등록일자, 등록사랑, 전자결재ID)
	 * @return
	 */
	public static int insertAtrzLine(List<Map<String, Object>> paramList, Map<String, String> basicInfo) {
	
		System.out.println("결재선");
		int atrzLnResult = -1;
		int refrnResult = -1;
		
    	final String atrzSttsCd = "VTW00801";
		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		Map<String, Object> tbParam = new HashMap<>();
		
		ArrayList<Map<String, Object>> refrnParams = new ArrayList<>();
		ArrayList<Map<String, Object>> atrzLnParams = new ArrayList<>();
		
		
		// 1. 결재선 리스트 정렬.
		final String sortKey = "approvalCode";
		
		Collections.sort(paramList, new Comparator<Map<String, Object>>() {
			
			@Override
			public int compare(Map<String, Object> map1, Map<String, Object> map2) {
				Comparable value1 = (Comparable) map1.get(sortKey);
				Comparable value2 = (Comparable) map2.get(sortKey);
				return value1.compareTo(value2);
			}
		}); 
		
		tbParam.put("tbNm", "ATRZ_LN");
		
		insertParams.add(0, tbParam);
    	
    	// 합의 참조 테이블과 결재선 테이블에 넣을 param 나누기
		for(int i = 0; i < paramList.size(); i++) {
			
			if(String.valueOf(paramList.get(i).get("approvalCode")).equals("VTW00706") ||
   			   String.valueOf(paramList.get(i).get("approvalCode")).equals("VTW00707")) {
				refrnParams.add(paramList.get(i));
				continue;
			}
			Map<String, Object> infoParam = new HashMap<>();
			
			infoParam.put("atrzStepCd", paramList.get(i).get("approvalCode"));
			infoParam.put("elctrnAtrzId", basicInfo.get("elctrnAtrzId"));
			infoParam.put("atrzLnSn", i+1);
			
			if(i == 0) {
				
				infoParam.put("atrzSttsCd", atrzSttsCd);
			} else {
				infoParam.put("atrzSttsCd", "VTW00806");
			}
			
			
			infoParam.put("aprvrEmpId", paramList.get(i).get("empId"));
			infoParam.put("regDt", basicInfo.get("regDt"));
			infoParam.put("regEmpId", basicInfo.get("regEmpId"));
			
			insertParams.add(infoParam);
		}
		
		try {
			atrzLnResult = commonService.insertData(insertParams);
			if(atrzLnResult > 0) {
				refrnResult = insertRefrnMan(refrnParams, basicInfo);
			}
			
		} catch (Exception e) {
			return -1;
		}
		
		return atrzLnResult; 
	}
	
	/**
	 * 참조 테이블 데이터 입력 메소드
	 * @param paramList
	 * @param basicInfo 기초 정보(등록일자, 등록사랑, 전자결재ID)
	 * @return
	 */
	public static int insertRefrnMan(List<Map<String, Object>> paramList, Map<String, String> basicInfo) {
		int result = -1;
		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		Map<String, Object> tbParam = new HashMap<>();
		
		tbParam.put("tbNm", "REFRN_MAN");
		insertParams.add(0, tbParam);
		for(int i = 0; i < paramList.size(); i++) {
			
			Map<String, Object> infoParam = new HashMap<>();
			infoParam.put("elctrnAtrzId", basicInfo.get("elctrnAtrzId"));
			infoParam.put("ccSn", i+1);
			infoParam.put("empId", paramList.get(i).get("empId"));
			infoParam.put("refrnCncrrncClCd", paramList.get(i).get("approvalCode"));
			
			insertParams.add(infoParam);
		}
		
		try {
			result = commonService.insertData(insertParams);
		} catch (Exception e) {
			return result;
		}
		
		return result;
	}
	
	
	/**
	 * 청구 결재 처리 메소드
	 * @param clmAtrzParam
	 * @param elctrnAtrzId	전자결재ID
	 * @return
	 */
	public static int insertClmAtrz(Map<String, Object> clmAtrzParam, String elctrnAtrzId) {
		
		System.out.println(clmAtrzParam);
		int result = -1;
		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		
		Map<String, Object> tbParam = new HashMap<>();
		Map<String, Object> infoParam=  new HashMap<>();
		
		tbParam.put("tbNm", "CLM_ATRZ");
		
		infoParam.put("clmAtrzTtl", clmAtrzParam.get("title"));
		infoParam.put("clmAtrzCn", clmAtrzParam.get("atrzCn"));
		infoParam.put("elctrnAtrzId", elctrnAtrzId);
		
		insertParams.add(0, tbParam);
		insertParams.add(1, infoParam);
		
		try {
			result = commonService.insertData(insertParams);
			insertClmAtrzDtl((List<Map<String, Object>>) clmAtrzParam.get("arrayData"), elctrnAtrzId);
			
		} catch (Exception e) {
			return result;
		}
		
		return result;
	}
	
	/**
	 * 청구 결재 상세 입력
	 * @param paramList
	 * @return
	 */
	public static int insertClmAtrzDtl(List<Map<String, Object>> paramList, String elctrnAtrzId) {
	
		int result = -1;
		System.out.println(paramList);
		
		for(int i = 1; i < paramList.size(); i++) {
			paramList.get(i).put("elctrnAtrzId", elctrnAtrzId);
		}
		
		try {
			result = commonService.insertData(paramList);
		} catch (Exception e) {
			return result;
		}
		
		return result;
	}
	
	
	/**
	 * 계약 결재 처리 메소드
	 * @param ctrtAtrzParam	
	 * @param atrzTySeCd	전자결재유형구분코드(VTW04909: 외주인력 계약 / VTW04909: 외주업체계약 / VTW04910: 재료비계약)
	 * @param elctrnAtrzId	전자결재ID
	 * @return
	 */
	public static int insertCtrtAtrz(Map<String, Object> ctrtAtrzParam, String atrzTySeCd, String elctrnAtrzId) {
		
		int result = -1;
		
		// 깊은 복사
		Map<String, Object> infoParam = new HashMap<>();

		infoParam.putAll(ctrtAtrzParam);
		
		infoParam.remove("arrayData");
		
		Map<String, Object> tbParam = new HashMap<>();
		
		tbParam.put("tbNm", infoParam.get("tbNm"));
		infoParam.put("elctrnAtrzId", elctrnAtrzId);
		infoParam.put("ctrtAtrzTtl", infoParam.get("title"));
		infoParam.put("ctrtAtrzCn", infoParam.get("atrzCn"));
		infoParam.remove("tbNm");
		infoParam.remove("title");
		infoParam.remove("atrzCn");

		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		insertParams.add(0, tbParam);
		insertParams.add(1, infoParam);
		
		try {
			result = commonService.insertData(insertParams);
			
			if(atrzTySeCd.equals("VTW04908")) {
				
				// 외주인력 처리 HNF_CTRT_DTL
				insertHnfCtrtDetail((List<Map<String, Object>>)ctrtAtrzParam.get("arrayData"), elctrnAtrzId);
			
			} else if(atrzTySeCd.equals("VTW04909")) {
				
				// 외주업체 처리
				insertEntrpsCtrtDetail((List<Map<String, Object>>)ctrtAtrzParam.get("arrayData"), elctrnAtrzId);
				
			} else if (atrzTySeCd.equals("VTW04910")) {
				
				// 재료비 처리
				insertMatrlCtrtDetail((List<Map<String, Object>>)ctrtAtrzParam.get("arrayData"), elctrnAtrzId);
			}
			
			
		} catch (Exception e) {
			return result;
		}
		
		return result;
	}
	
	/**
	 * 계약결재 중 재료비 계약 상세 처리 메소드
	 * Target Table: ENTRPS_CTRT_DTL
	 * @param paramList
	 * @param elctrnAtrzId	전자결재ID
	 * @return
	 */
	public static int insertMatrlCtrtDetail(List<Map<String, Object>> paramList, String elctrnAtrzId) {
	
		int ctrtDtlresult = -1;
		ArrayList<Map<String, Object>> copiedParams = new ArrayList<>();		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		
		Map<String, Object> tbParam = new HashMap<>();

		
		for(Map<String, Object> originalMap: paramList) {
			
			Map<String, Object> copiedMap = new HashMap<>();
			
			for(Map.Entry<String, Object> entry : originalMap.entrySet()) {
				
				copiedMap.put(entry.getKey(), entry.getValue());
			}
				
				copiedParams.add(copiedMap);
		}
		
		tbParam.put("tbNm", paramList.get(0).get("tbNm"));
		insertParams.add(0, tbParam);
		
		for(int i = 1; i < copiedParams.size(); i++) {
			Map<String, Object> infoParam = new HashMap<>();
			
			copiedParams.get(i).remove("pay");
			infoParam.put("elctrnAtrzId", elctrnAtrzId);
			infoParam.put("entrpsCtrtDtlSn", copiedParams.get(i).get("entrpsCtrtDtlSn"));
			infoParam.put("prductNm", copiedParams.get(i).get("prductNm"));
			infoParam.put("dtlCn", copiedParams.get(i).get("dtlCn"));
			infoParam.put("untpc", copiedParams.get(i).get("untpc"));
			infoParam.put("qy", copiedParams.get(i).get("qy"));
			infoParam.put("dlvgdsPrnmntYmd", copiedParams.get(i).get("dlvgdsPrnmntYmd"));
			infoParam.put("totAmt", copiedParams.get(i).get("totAmt"));
			infoParam.put("expectCtrtEntrpsNm", copiedParams.get(i).get("expectCtrtEntrpsNm"));
			insertParams.add(i, infoParam);
		}
		
		try {
			ctrtDtlresult = commonService.insertData(insertParams);
			if(ctrtDtlresult > 0) {
				for(int i = 1; i < paramList.size(); i++) {
					
					int aaa = insertEntrpsCtrtDetailCondtion((List<Map<String, Object>>)paramList.get(i).get("pay"), paramList.get(i).get("entrpsCtrtDtlSn").toString(), elctrnAtrzId);
				}
			}
		} catch (Exception e) {
			return ctrtDtlresult;

		}
		
		return ctrtDtlresult;
	}
	
	
	
	/**
	 * 계약결재 중 외주업체 계약 상세 처리 메소드
	 * Target Table: ENTRPS_CTRT_DTL
	 * @param paramList
	 * @param elctrnAtrzId	전자결재ID
	 * @return
	 */
	public static int insertEntrpsCtrtDetail(List<Map<String, Object>> paramList, String elctrnAtrzId) {
		
		int ctrtDtlresult = -1;
		ArrayList<Map<String, Object>> copiedParams = new ArrayList<>();		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		
		Map<String, Object> tbParam = new HashMap<>();
		
		for(Map<String, Object> originalMap: paramList) {
			
			Map<String, Object> copiedMap = new HashMap<>();
			
			for(Map.Entry<String, Object> entry : originalMap.entrySet()) {
				
				copiedMap.put(entry.getKey(), entry.getValue());
			}
				
				copiedParams.add(copiedMap);
		}
			
		tbParam.put("tbNm", paramList.get(0).get("tbNm"));
		insertParams.add(0, tbParam);
		
		for(int i = 1; i < copiedParams.size(); i++) {
			
			Map<String, Object> infoParam = new HashMap<>();
			
			copiedParams.get(i).remove("pay");
			infoParam.put("elctrnAtrzId", elctrnAtrzId);
			infoParam.put("prductNm", copiedParams.get(i).get("prductNm"));
			infoParam.put("entrpsCtrtDtlSn", copiedParams.get(i).get("entrpsCtrtDtlSn"));
			infoParam.put("tkcgJob", copiedParams.get(i).get("tkcgJob"));
			infoParam.put("inptPrnmntHnfCnt", copiedParams.get(i).get("inptPrnmntHnfCnt"));
			infoParam.put("inptBgngYmd", copiedParams.get(i).get("ctrtBgngYmd"));
			infoParam.put("inptEndYmd", copiedParams.get(i).get("ctrtEndYmd"));
			infoParam.put("totAmt", copiedParams.get(i).get("totAmt"));
			infoParam.put("expectCtrtEntrpsNm", copiedParams.get(i).get("expectCtrtEntrpsNm"));
			
			
			insertParams.add(i, infoParam);
		}
		try {
			ctrtDtlresult = commonService.insertData(insertParams);
			if(ctrtDtlresult > 0) {
				
				for(int i = 1; i < paramList.size(); i++) {
					
					int ctrtResult = insertEntrpsCtrtDetailCondtion((List<Map<String, Object>>)paramList.get(i).get("pay"), paramList.get(i).get("entrpsCtrtDtlSn").toString(), elctrnAtrzId);
				}
				
			}
			
		} catch (Exception e) {
			return ctrtDtlresult;
		}
		
		return ctrtDtlresult;
	}
	
	
	/**
	 * 계약결재 중 업체 / 재료비 계약 상세조건 처리 메소드
	 * Target Table: ENTRPS_CTRT_DTL_CND
	 */
	public static int insertEntrpsCtrtDetailCondtion(List<Map<String, Object>> paramList, String entrpsCtrtDtlSn, String elctrnAtrzId) {
		
		int result = -1;
		
		System.out.println("마지막");
		System.out.println(paramList);
		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		insertParams.add(0, paramList.get(0));
		for(int i = 1; i < paramList.size(); i++) {
			insertParams.add(i, paramList.get(i));
			insertParams.get(i).put("elctrnAtrzId", elctrnAtrzId);
			insertParams.get(i).put("entrpsCtrtDtlSn", entrpsCtrtDtlSn);
		}
		
		System.err.println(paramList);
		
		try {
			result = commonService.insertData(insertParams);
		} catch(Exception e) {
			return result;
		}
		
		return result;
	}
	
	/**
	 * 계약결재 중 외주인력 계약 상세 처리 메소드
	 * @param paramList
	 * @param elctrnAtrzId
	 * @return
	 */
	public static int insertHnfCtrtDetail(List<Map<String, Object>> paramList, String elctrnAtrzId) {
		
		int ctrtDtlResult = -1;
		
		ArrayList<Map<String, Object>> copiedParams = new ArrayList<>();		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		
		Map<String, Object> tbParam = new HashMap<>();

		
		for(Map<String, Object> originalMap: paramList) {
			
			Map<String, Object> copiedMap = new HashMap<>();
			
			for(Map.Entry<String, Object> entry : originalMap.entrySet()) {
				
				copiedMap.put(entry.getKey(), entry.getValue());
			}
				
				copiedParams.add(copiedMap);
		}
			
		tbParam.put("tbNm", paramList.get(0).get("tbNm"));
		insertParams.add(0, tbParam);
		
		for(int i = 1; i < copiedParams.size(); i++) {
			Map<String, Object> infoParam = new HashMap<>();
			
			copiedParams.get(i).remove("hnfCtrtDtlMm");
			infoParam.put("elctrnAtrzId", elctrnAtrzId);
			infoParam.put("outordHnfCtrtSeCd", copiedParams.get(i).get("outordHnfCtrtSeCd"));	// 외주인력계약구분코드
			infoParam.put("inptHnfId", copiedParams.get(i).get("inptHnfId"));						// 투입인력
			infoParam.put("hnfRoleCd", copiedParams.get(i).get("hnfRoleCd"));					// 인력 역할 코드
			infoParam.put("hnfGradCd", copiedParams.get(i).get("hnfGradCd"));					// 인력 등급 코드
			infoParam.put("tkcgJob", copiedParams.get(i).get("tkcgJob"));						// 담당 업무
			infoParam.put("untpc", copiedParams.get(i).get("untpc"));							// 단가
			infoParam.put("inptPrnmntYmd", copiedParams.get(i).get("inptPrnmntYmd"));			// 투입예정일자
			infoParam.put("withdrPrnmntYmd", copiedParams.get(i).get("withdrPrnmntYmd"));		// 철수예정일자
			infoParam.put("expectInptHnfId", copiedParams.get(i).get("expectInptHnfId"));			// 계획투입인력
			infoParam.put("outordLbrcoPrmpcSn", copiedParams.get(i).get("outordLbrcoPrmpcSn"));			// 계획투입인력 순번
			
			insertParams.add(i, infoParam);
		}
		try {
			ctrtDtlResult = commonService.insertData(insertParams);
			if(ctrtDtlResult > 0) {
				
				for(int i = 1; i < paramList.size(); i++) {
					
					int ctrtResult = insertHnfCtrtDetailMm((List<Map<String, Object>>)paramList.get(i).get("hnfCtrtDtlMm"), paramList.get(i).get("inptHnfId").toString(), elctrnAtrzId);
				}
				
			}
			
		} catch (Exception e) {
			return ctrtDtlResult;
		}
		
		return 1;
	}
	
	/**
	 * 계약결재 중 외주 인력 데이터 MM 상세 처리 메소드
	 * @param paramList: 기타 데이터
	 * @param empId: 투입 외주 인력 ID
	 * @param elctrnAtrzId: 전자결재 ID
	 * @return
	 */
	public static int insertHnfCtrtDetailMm(List<Map<String, Object>> paramList, String inptHnfId, String elctrnAtrzId) {
		int result = -1;
		
		System.out.println("Last Table");
		System.out.println(paramList);
		
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		insertParams.add(0, paramList.get(0));
		for(int i = 1; i < paramList.size(); i++) {
			
			Map<String, Object> infoParam = new HashMap<>();
			infoParam.put("elctrnAtrzId", elctrnAtrzId);
			infoParam.put("inptHnfId", inptHnfId);
			infoParam.put("inptYm", paramList.get(i).get("id"));
			infoParam.put("mm", paramList.get(i).get("mm"));
			infoParam.put("indvdlGiveCtrtAmt", paramList.get(i).get("indvdlGiveCtrtAmt")); 	
			infoParam.put("entrpsGiveCtrtAmt", paramList.get(i).get("entrpsGiveCtrtAmt"));
			
			insertParams.add(i, infoParam);
		}
		
		System.err.println(paramList);
		
		try {
			result = commonService.insertData(insertParams);
		} catch(Exception e) {
			return result;
		}
		
		return result;
	}
	
	/**
	 * 전자결재 승인 메소드
	 * @param paramList
	 * @return
	 */
	public static Map<String, Object> aprvElecAtrz(List<Map<String, Object>> paramList) {
		
		String aprvrEmpId = String.valueOf(paramList.get(2).get("aprvrEmpId"));	// 현재 승인자
		String elctrnAtrzId = String.valueOf(paramList.get(2).get("elctrnAtrzId")); // 전자결재 아이디
		
		
		int atrzLnSn = Integer.parseInt(String.valueOf(paramList.get(2).get("atrzLnSn"))); // 현재 승인자의 결재단계(순번)
		
		int uptResult = -1;
		
		Map<String, Object> selectParam = new HashMap<>();
		
		selectParam.put("queryId", "elecAtrzMapper.retrieveElecAtrzLn");
		selectParam.put("atrzLnSn", atrzLnSn);
		selectParam.put("elctrnAtrzId", elctrnAtrzId);
		
		//  결재라인 가져오기
		List<Map<String, Object>> atrzLine = commonService.queryIdSearch(selectParam);
		
		List<Map<String, Object>> resultList = new ArrayList<>();
		HashMap<String, Object> resultMap = new HashMap<>();
		
		try {
			for(int i = 0; i < atrzLine.size(); i++) {
				
				Map<String, Object> updateParam = new HashMap<>();
				List<Map<String, Object>> updateParams = new ArrayList<>();
				Map<String, Object> conditionParam = new HashMap<>();
				
				if(Integer.parseInt(String.valueOf(atrzLine.get(i).get("atrzLnSn"))) == atrzLnSn && 
					String.valueOf(atrzLine.get(i).get("aprvrEmpId")).equals(aprvrEmpId)) {
					
					
					updateParams.add(0, paramList.get(0));	// 업데이트할 타겟 테이블
					updateParams.add(1, paramList.get(1));	// 업데이트할 테이블의 내용
					
					updateParam.put("elctrnAtrzId", elctrnAtrzId);
					updateParam.put("aprvrEmpId", aprvrEmpId);
					updateParam.put("atrzLnSn", atrzLnSn);
					
					updateParams.add(2, updateParam);
					
					uptResult = commonService.updateData(updateParams);
					
					if(uptResult < 0) {
						resultMap.put("atrzLnSn", 0);
						return resultMap;
					}
					
					atrzLnSn++;
					
				} else {
					updateParams.add(0, paramList.get(0));	// 업데이트할 타겟 테이블
					conditionParam.put("atrzLnSn", atrzLnSn);
					conditionParam.put("elctrnAtrzId", elctrnAtrzId);
					
					updateParam.put("atrzSttsCd", "VTW00801");

					updateParams.add(1, updateParam); // 업데이트할 정보
					updateParams.add(2, conditionParam); // 업데이트할 테이블의 조건

					uptResult = commonService.updateData(updateParams);
				}
				
			}
						
			/**
			 * 휴가결재 에서 사용하기 위해서
			 * 가장 높은 결재 순번을 찾아와서 마지막 결재인지 확인해주기.
			 */
			HashMap<String, Object> maxQueryMap = new HashMap<>();
			maxQueryMap.put("queryId", "elecAtrzMapper.retrieveMaxAtrzLnSn");
			maxQueryMap.put("elctrnAtrzId", elctrnAtrzId);
			
			List<Map<String, Object>> maxResult = commonService.queryIdSearch(maxQueryMap);
			
			// 최종 승인 순번
			int maxAtrzLnSn = Integer.parseInt(String.valueOf(maxResult.get(0).get("maxAtrzLnSn")));
			
			List<Map<String, Object>> selectAtrzList = new ArrayList<>();
			HashMap<String, Object> tbParam = new HashMap<>();
			HashMap<String, Object> infoParam = new HashMap<>();
			
			tbParam.put("tbNm", "ATRZ_LN");
			
			if(atrzLnSn > maxAtrzLnSn) {
				/**
				 * 이 경우 최종 결재까지 진행되었음.
				 * max 값으로 조회한다.
				 */
				infoParam.put("atrzLnSn", maxAtrzLnSn);
			} else {
				infoParam.put("atrzLnSn", atrzLnSn);
			}

			infoParam.put("elctrnAtrzId", elctrnAtrzId);
			
			selectAtrzList.add(0, tbParam);
			selectAtrzList.add(1, infoParam);
			
			resultList = commonService.commonSelect(selectAtrzList);
			
			resultMap.put("atrzLnSn", atrzLnSn);
			resultMap.put("atrzStepCd", resultList.get(0).get("atrzStepCd"));
			
		} catch(Exception e) {
			resultMap.put("atrzLnSn", 0);
			return resultMap;
		}
		
		return resultMap;
	}
	
	/**
	 * 청구결재 최종 승인시 프로젝트 비용청구 테이블에 insert 해준다.
	 * Target Table: PRJCT_CT_APLY, PRJCT_CT_ATRZ
	 * @param param
	 * @return
	 */
	public static int insertPrjctCt(Map<String, Object> param) {
		int result = -1;
		
		Map<String, Object> selectParam = new HashMap<>();
		selectParam.put("queryId", "elecAtrzMapper.retrieveClmAtrzInfo");
		selectParam.put("elctrnAtrzId", param.get("elctrnAtrzId"));
		
		try {
			List<Map<String, Object>> list = commonService.queryIdSearch(selectParam);
			
			Map<String, Object> masterTbParam = new HashMap<>();
			Map<String, Object> slaveTbParam = new HashMap<>();
			masterTbParam.put("tbNm", "PRJCT_CT_APLY");
			slaveTbParam.put("tbNm", "PRJCT_CT_ATRZ");
			
			// PRJCT_CT_APLY 테이블에 데이터 추가
			for(int i = 0; i < list.size(); i++) {
				List<Map<String, Object>> insertMasterParam = new ArrayList<>();
				List<Map<String, Object>> insertSlaveParam = new ArrayList<>();
				
				insertMasterParam.add(0, masterTbParam);
				insertSlaveParam.add(0, slaveTbParam);
				
				int masterResult = 0;
				int slaveResult = 0;
				
				Map<String, Object> selectMaxParam = new HashMap<>();
				selectMaxParam.put("queryId", "indvdlClmMapper.retrievePrjctCtAplySn");
				
				List<Map<String, Object>> selectMaxPrjctCtAplySn = commonService.queryIdSearch(selectMaxParam);
				int prjctCtAplySn = 0;
				
				if(String.valueOf(selectMaxPrjctCtAplySn.get(0).get("prjctCtAplySn")).equals("null") ||
				   String.valueOf(selectMaxPrjctCtAplySn.get(0).get("prjctCtAplySn")).equals(null)) {
					prjctCtAplySn = 1;
				} else {
					prjctCtAplySn = Integer.parseInt(String.valueOf(selectMaxPrjctCtAplySn.get(0).get("prjctCtAplySn"))) + 1;
				}
				
				Map<String, Object> masterInfoParam = new HashMap<>();
				
				masterInfoParam.put("prjctCtAplySn", prjctCtAplySn);
				masterInfoParam.put("aplyYm", param.get("aplyYm"));
				masterInfoParam.put("aplyOdr", param.get("aplyOdr"));
				masterInfoParam.put("empId", param.get("empId"));
				masterInfoParam.put("prjctId", param.get("prjctId"));
				masterInfoParam.put("elctrnAtrzId", param.get("elctrnAtrzId"));
				masterInfoParam.put("expensCd", list.get(i).get("expensCd"));
				masterInfoParam.put("utztnDt", list.get(i).get("utztnDt"));
				masterInfoParam.put("useOffic", list.get(i).get("useOffic"));
				masterInfoParam.put("utztnAmt", list.get(i).get("utztnAmt"));
				masterInfoParam.put("atdrn", list.get(i).get("atdrn"));
				masterInfoParam.put("ctPrpos", list.get(i).get("ctPrpos"));
				masterInfoParam.put("ctAtrzSeCd", list.get(i).get("ctAtrzSeCd"));
				masterInfoParam.put("regDt", param.get("regDt"));
				masterInfoParam.put("regEmpId", param.get("regEmpId"));
				
				insertMasterParam.add(1, masterInfoParam);
				
				Map<String, Object> slaveInfoParam = new HashMap<>();
				slaveInfoParam.put("prjctCtAplySn", prjctCtAplySn);
				slaveInfoParam.put("atrzDmndSttsCd", list.get(i).get("atrzDmndSttsCd"));
				slaveInfoParam.put("aprvrEmpId", list.get(i).get("aprvrEmpId"));
				slaveInfoParam.put("prjctId", param.get("prjctId"));
				slaveInfoParam.put("empId", param.get("empId"));
				slaveInfoParam.put("aplyYm", param.get("aplyYm"));
				slaveInfoParam.put("aplyOdr", param.get("aplyOdr"));
				slaveInfoParam.put("aprvYmd", list.get(i).get("aprvYmd"));
				slaveInfoParam.put("regDt", param.get("regDt"));
				slaveInfoParam.put("regEmpId", param.get("regEmpId"));
				
				insertSlaveParam.add(1, slaveInfoParam);
				
				masterResult = commonService.insertData(insertMasterParam);
				slaveResult = commonService.insertData(insertSlaveParam);

				if(masterResult > 0 && slaveResult > 0) {
					result = 1;
				}
			}

			return result;
			
		} catch (Exception e) {
			return -1;
		}
	}
	

	/**
	 * 결재 지급 처리 메소드
	 * @param giveAtrzParam
	 * @param elctrnAtrzId	전자결재ID
	 * @return
	 */
	@Transactional
	public static int insertGiveAtrz(Map<String, Object> giveAtrzParam, String elctrnAtrzId) {
		System.out.println("###  giveAtrzParam  ####" + giveAtrzParam);
		int result = -1;
		
		Object ctrtObject = giveAtrzParam.get("ctrt");
			
		ArrayList<Map<String, Object>> insertParams = new ArrayList<>();
		
		Map<String, Object> tbParam = new HashMap<>();
		Map<String, Object> infoParam=  new HashMap<>();
		
		tbParam.put("tbNm", "CTRT_GIVE_ATRZ");
		
		infoParam.put("atrzTtl", giveAtrzParam.get("title"));
		infoParam.put("stlmCn", giveAtrzParam.get("atrzCn"));
		infoParam.put("elctrnAtrzId", elctrnAtrzId);

//		infoParam.put("atchmnflId", giveAtrzParam.get("atchmnflId"));
        infoParam.put("giveAmt", giveAtrzParam.get("giveAmt"));
        infoParam.put("giveYmd", giveAtrzParam.get("giveYmd"));
        infoParam.put("ctrtElctrnAtrzId", giveAtrzParam.get("ctrtElctrnAtrzId"));
        infoParam.put("vatExclAmt", giveAtrzParam.get("vatExclAmt"));
        infoParam.put("taxBillPblcnYmd", giveAtrzParam.get("taxBillPblcnYmd"));
        infoParam.put("giveOdrCd", giveAtrzParam.get("giveOdrCd"));
        infoParam.put("entrpsCtrtDtlSn", giveAtrzParam.get("entrpsCtrtDtlSn"));

        insertParams.add(0, tbParam);
        insertParams.add(1, infoParam);

        try {
            result = commonService.insertData(insertParams);

            if (result > 0) {

                System.out.println("#### ctrtObject ####" + ctrtObject);
                if (ctrtObject instanceof ArrayList) {
                    ArrayList<Map<String, Object>> ctrtInsertParams = (ArrayList<Map<String, Object>>) ctrtObject;

                    System.out.println("#### ctrtInsertParams  ####" + ctrtInsertParams);

                    for (int i = 0; i < ctrtInsertParams.size(); i++) {
                        Map<String, Object> ctrtItem = ctrtInsertParams.get(i); // i번째 아이템을 가져옵니다.                   
                        
                        Map<String, Object> ctrtGiveAtrzDtlMap = new HashMap<>();
                        ctrtGiveAtrzDtlMap.put("queryId", "elecAtrzMapper.mergeCtrtGiveAtrzDtl");
                        ctrtGiveAtrzDtlMap.put("elctrnAtrzId", elctrnAtrzId);
                        ctrtGiveAtrzDtlMap.put("ctrtElctrnAtrzId", elctrnAtrzId);
                        ctrtGiveAtrzDtlMap.put("entrpsCtrtDtlSn", ctrtItem.get("entrpsCtrtDtlSn"));
                        ctrtGiveAtrzDtlMap.put("giveAmt", ctrtItem.get("giveAmt"));
                        ctrtGiveAtrzDtlMap.put("outordLbrcoPrmpcSn", ctrtItem.get("outordLbrcoPrmpcSn"));
					
                        System.out.println("#### ctrtItem  ####" + ctrtGiveAtrzDtlMap);

                        commonService.queryIdSearch(ctrtGiveAtrzDtlMap);
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            return result;
        }

        return result;
    }


    public static int insertGnrlAtrz(Map<String, Object> gnrlAtrzParam, String elctrnAtrzId) {
        System.out.println(gnrlAtrzParam);
        int result = -1;

        ArrayList<Map<String, Object>> insertParams = new ArrayList<>();

        Map<String, Object> tbParam = new HashMap<>();
        Map<String, Object> infoParam = new HashMap<>();

        tbParam.put("tbNm", "GNRL_ATRZ");

        infoParam.put("elctrnAtrzId", elctrnAtrzId);
        infoParam.put("gnrlAtrzTtl", gnrlAtrzParam.get("title"));
        infoParam.put("gnrlAtrzCn", gnrlAtrzParam.get("atrzCn"));

        insertParams.add(0, tbParam);
        insertParams.add(1, infoParam);

        try {
            result = commonService.insertData(insertParams);

        } catch (Exception e) {
            return result;
        }

        return result;
    }
}  
