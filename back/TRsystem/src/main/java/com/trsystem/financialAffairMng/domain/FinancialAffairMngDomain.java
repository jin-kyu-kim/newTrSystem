package com.trsystem.financialAffairMng.domain;

import java.util.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

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
			
			ctDataList = commonService.queryIdSearch(params);
			
			System.out.println(ctDataList.size());
			
			/*
			 * 조회된 데이터가 존재할 때만 작동
			 */
			if(ctDataList.size() > 0) {
				
				params.put("prjctCtAplySn", ctDataList.get(0).get("prjctCtAplySn"));
				params.put("prjctId", ctDataList.get(0).get("prjctId"));
				params.put("queryId", "financialAffairMngMapper.retrieveCtPivotData");
				
			} else {
				
				return pivotCtDataList;
			}
			
			
			/**
			 * 2. 실제 데이터 중 하나를 사용해서 day column을 만들기
			 */
			pivotCtDataList = commonService.queryIdSearch(params);
		
			return pivotCtDataList;
		} catch(Exception e) {
			
		}
		
		return pivotCtDataList;
	}

	public static List<Map<String, Object>> updateClturPhstrnActct(List<Map<String, Object>> params) {

		Map<String, Object> changedValue = params.get(1);
		Map<String, Object> keyValue = (Map<String, Object>) params.get(2).get("clturPhstrnActCtSn,empId");

		// 등록 테이블 업데이트
		List<Map<String, Object>> updateParam = new ArrayList<>();
		updateParam.add(params.get(0));
		updateParam.add(changedValue);
		updateParam.add(keyValue);
		commonService.updateData(updateParam);

		return null;
	}
	
	@Transactional
	public static int updateDpstAmt(Map<String, Object> param) {
		param.put("queryId", "financialAffairMngMapper.updateDpstAmtThisMonth");
		param.put("state", "UPDATE");
		YearMonth yearMonth = YearMonth.parse((String)param.get("clturPhstrnActMngYm"), DateTimeFormatter.ofPattern("yyyyMM"));
		LocalDate nextMonth = yearMonth.atDay(1).plusMonths(1);
		param.put("nextMonth", nextMonth.format(DateTimeFormatter.ofPattern("yyyyMM")));
		commonService.queryIdDataControl(param);
		param.put("queryId", "financialAffairMngMapper.updateDpstAmtNextMonth");
		commonService.queryIdDataControl(param);
		return 1;
	}
	
	@Transactional
	public static int cancelMmCtAtrz(List<List<Map<String, Object>>> paramList) {
		
		int result = 0;

		try {
			for(int i = 0; i < paramList.size(); i++) {
				result = commonService.updateData(paramList.get(i));
			}
			
		} catch (Exception e) {
			result = 0;
		}
		
		return result;
		
	}
	
}
