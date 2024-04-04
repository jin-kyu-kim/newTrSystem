package com.trsystem.elecAtrz.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
	 * @param params
	 * @return
	 */
	public static String insertElecAtrz(Map<String, Object> params) {
		
		System.out.println(params);
		
		// 공통
		String regDt = String.valueOf(params.get("regDt"));
		String regEmpId = String.valueOf(params.get("regEmpId"));
		String atrzTySeCd = String.valueOf(params.get("elctrnAtrzTySeCd"));
		String elctrnAtrzId =  String.valueOf(params.get("elctrnAtrzId"));
		
		Map<String, String> basicInfo = new HashMap<>();
		basicInfo.put("regDt", regDt);
		basicInfo.put("regEmpId", regEmpId);
		basicInfo.put("elctrnAtrzId", elctrnAtrzId);
		
		Map<String, Object> elecAtrzParam = new HashMap<>();
		Map<String, Object> tbParam = new HashMap<>();
		
		// 전자결재 테이블에 insert 한다.
		elecAtrzParam.putAll(params);
		elecAtrzParam.put("nowAtrzLnSn", 1);
		elecAtrzParam.put("atrzDmndEmpId", regEmpId);
		elecAtrzParam.remove("param");
		
		System.out.println(elecAtrzParam);
    	List<Map<String, Object>> insertParams = new ArrayList<>();
    	
    	tbParam.put("tbNm", "ELCTRN_ATRZ");
    	
    	insertParams.add(0, tbParam);
    	insertParams.add(elecAtrzParam);

		int electrnAtrzResult = -1;
		int atrzLnResult = -1;
		int atrzTyResult = -1;
		
		try {
			
			// 전자결재 테이블 데이터 삽입
			electrnAtrzResult = commonService.insertData(insertParams);
			electrnAtrzResult = 1;
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
					
					
				} else {
					System.out.println("개발중");
				}
				
				if(electrnAtrzResult < 0 || atrzTyResult < 0 || atrzLnResult < 0) return null;
				
			}
			
			
		} catch (Exception e) {
			return null;
		}

		
		return elctrnAtrzId;
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
		
//		VTW00701	기안
//		VTW00702	검토
//		VTW00703	확인
//		VTW00704	심사
//		VTW00705	승인
		
//		VTW00706	참조
//		VTW00707	합의
		
		// 1. 정렬.
		final String sortKey = "approvalCode";
		
		Collections.sort(paramList, new Comparator<Map<String, Object>>() {
			
			@Override
			public int compare(Map<String, Object> map1, Map<String, Object> map2) {
				Comparable value1 = (Comparable) map1.get(sortKey);
				Comparable value2 = (Comparable) map2.get(sortKey);
				return value1.compareTo(value2);
			}
		}); 
		
		System.out.println(paramList);
		
		tbParam.put("tbNm", "ATRZ_LN");
		
    	String atrzStepCd[] = {"VTW00705", "VTW00704", "VTW00703", "VTW00702", "VTW00701"};
    	
    	// 합의 저장?? -> 참조에 같이 넣는다.
		
		
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
			infoParam.put("atrzSttsCd", atrzSttsCd);
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
		
		System.out.println(ctrtAtrzParam);
		
		// 깊은 복사
		Map<String, Object> infoParam = new HashMap<>();

		infoParam.putAll(ctrtAtrzParam);
		
		infoParam.remove("arrayData");
		
		System.out.println(infoParam);
		
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
			
			System.out.println(atrzTySeCd);
			
			if(atrzTySeCd.equals("VTW04908")) {
				
				// 외주인력 처리
				
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
	
		System.out.println("재료비 계약 상세");
		System.out.println(paramList);
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
		
		System.out.println(copiedParams);
			
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
			insertParams.add(i, infoParam);
		}
		
		System.out.println(insertParams);
		
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
		Map<String, Object> infoParam = new HashMap<>();
		
		for(Map<String, Object> originalMap: paramList) {
			
			Map<String, Object> copiedMap = new HashMap<>();
			
			for(Map.Entry<String, Object> entry : originalMap.entrySet()) {
				
				copiedMap.put(entry.getKey(), entry.getValue());
			}
				
				copiedParams.add(copiedMap);
		}
			
		tbParam.put("tbNm", paramList.get(0).get("tbNm"));
		
		for(int i = 1; i < copiedParams.size(); i++) {
			
			copiedParams.get(i).remove("pay");
			infoParam.put("elctrnAtrzId", elctrnAtrzId);
			infoParam.put("entrpsCtrtDtlSn", copiedParams.get(i).get("entrpsCtrtDtlSn"));
			infoParam.put("tkcgJob", copiedParams.get(i).get("tkcgJob"));
			infoParam.put("inptPrnmntHnfCnt", copiedParams.get(i).get("inptPrnmntHnfCnt"));
			infoParam.put("inptBgngYmd", copiedParams.get(i).get("inptBgngYmd"));
			infoParam.put("inptEndYmd", copiedParams.get(i).get("inptEndYmd"));
			infoParam.put("totAmt", copiedParams.get(i).get("totAmt"));
			
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
}
