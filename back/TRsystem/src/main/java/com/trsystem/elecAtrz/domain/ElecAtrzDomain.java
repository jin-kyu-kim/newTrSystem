package com.trsystem.elecAtrz.domain;

import java.util.ArrayList;
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
	 * 전자결재
	 * @param params
	 * @return
	 */
	public static String insertElecAtrz(Map<String, Object> params) {
		
		System.out.println(params);
		
		// 공통
		String regDt = String.valueOf(params.get("regDt"));
		
		String result = params.get("elctrnAtrzId").toString();
		
		Map<String, Object> elecAtrzParam = new HashMap<>();
		Map<String, Object> tbParam = new HashMap<>();
		
//		elecAtrzParam.put("elctrnAtrzId", params.get("elctrnAtrzId"));
		// 전자결재 테이블에 insert 한다.
		
		elecAtrzParam.putAll(params);
		elecAtrzParam.remove("param");
		
		System.out.println(elecAtrzParam);
    	List<Map<String, Object>> insertParams = new ArrayList<>();
    	
    	tbParam.put("tbNm", "ELCTRN_ATRZ");
    	
    	
    	insertParams.add(0, tbParam);
    	insertParams.add(elecAtrzParam);
    	

		System.out.println(((Map<String, Object>) params.get("param")).get("arrayData"));
		
		String atrzTySeCd = elecAtrzParam.get("elctrnAtrzTySeCd").toString();
		String elctrnAtrzId = elecAtrzParam.get("elctrnAtrzId").toString();

		int insertResult1 = -1;
		int insertResult2 = -1;
		try {
			
			// 전자결재 테이블 데이터 삽입
			insertResult1 = commonService.insertData(insertParams);
			
			if(atrzTySeCd.equals("VTW04908") || atrzTySeCd.equals("VTW04909") || atrzTySeCd.equals("VTW04910")) {
				
				Map<String, Object> map = new HashMap<>();
				
				map.putAll(((Map<String, Object>) params.get("param")));
				
				insertResult2 = insertCtrtAtrz(map, atrzTySeCd, elctrnAtrzId);
				
				if(insertResult1 < 0 || insertResult2 < 0) return null;
				
			} else if(atrzTySeCd.equals("VTW04907")) {
				Map<String, Object> map = new HashMap<>();
				
				map.putAll(((Map<String, Object>) params.get("param")));
				insertResult2 = insertClmAtrz(map, elctrnAtrzId);
				
				
			} else {
				System.out.println("개발중");
			}
			
			
		} catch (Exception e) {
			return null;
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
		int result = -1;
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
			result = commonService.insertData(insertParams);
			result = 1;
			if(result > 0) {
				for(int i = 1; i < paramList.size(); i++) {
					
					int aaa = insertEntrpsCtrtDetailCondtion((List<Map<String, Object>>)paramList.get(i).get("pay"), paramList.get(i).get("entrpsCtrtDtlSn").toString(), elctrnAtrzId);
				}
			}
		} catch (Exception e) {
			

		}
		
		return result;
	}
	
	
	
	/**
	 * 계약결재 중 외주업체 계약 상세 처리 메소드
	 * Target Table: ENTRPS_CTRT_DTL
	 * @param paramList
	 * @param elctrnAtrzId	전자결재ID
	 * @return
	 */
	public static int insertEntrpsCtrtDetail(List<Map<String, Object>> paramList, String elctrnAtrzId) {
		
		int result = -1;
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
			result = commonService.insertData(insertParams);
			result = 1;
			if(result > 0) {
				
				for(int i = 1; i < paramList.size(); i++) {
					
					int aaa = insertEntrpsCtrtDetailCondtion((List<Map<String, Object>>)paramList.get(i).get("pay"), paramList.get(i).get("entrpsCtrtDtlSn").toString(), elctrnAtrzId);
				}
				
				
			}
			
		} catch (Exception e) {
			return result;
		}
		
		return result;
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
