package com.trsystem.financialAffairMng.domain;

import java.util.ArrayList;
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
public class FinancialAffairMngDomain {

private static CommonService commonService;
	
	@Autowired
	public FinancialAffairMngDomain(CommonService commonService) {
		FinancialAffairMngDomain.commonService = commonService;
	}

	@Transactional
	public static List<Map<String, Object>> retrieveCtData(Map<String, Object> params) {
		

		
		/**
		 * 1. 조건에 부합하는 실제 데이터 PRJCT_CT_APLY_SN 컬럼 조회
		 */
		List<Map<String, Object>> ctDataList = new ArrayList<>();
		
		List<Map<String, Object>> pivotCtDataList = new ArrayList<>();
		
		try {
			params.put("queryId", "financialAffairMngMapper.retrieveCtData");
			System.out.println(params);
			
			ctDataList = commonService.queryIdSearch(params);
			
			System.out.println(ctDataList.size());
			
			/*
			 * 조회된 데이터가 존재할 때만 작동
			 */
			if(ctDataList.size() > 0) {
				
				params.put("prjctCtAplySn", ctDataList.get(0).get("prjctCtAplySn"));
				params.put("queryId", "financialAffairMngMapper.retrieveCtPivotData");
				
			} else {
				
				return pivotCtDataList;
			}
			
			
			/**
			 * 2. 실제 데이터 중 하나를 사용해서 day column을 만들기
			 */
			System.out.println(params);
			pivotCtDataList = commonService.queryIdSearch(params);
		
			return pivotCtDataList;
		} catch(Exception e) {
			
		}
		
		return pivotCtDataList;
	}
}
