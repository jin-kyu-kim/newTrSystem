package com.trsystem.financialAffairMng.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
		Map<String, Object> updateClturPhstrnActctRegMap = new HashMap<>();

		for(int i = 0; i < params.size(); i++){
			updateClturPhstrnActctRegMap.clear();

			updateClturPhstrnActctRegMap.put("queryId", "financialAffairMngMapper.updateClturPhstrnActctReg");
			updateClturPhstrnActctRegMap.put("state", "UPDATE");
			updateClturPhstrnActctRegMap.put("clturPhstrnSeCd", params.get(i).get("clturPhstrnSeCd"));
			updateClturPhstrnActctRegMap.put("clmAmt", params.get(i).get("clmAmt"));
			updateClturPhstrnActctRegMap.put("rm", params.get(i).get("rm"));
			updateClturPhstrnActctRegMap.put("clturPhstrnActCtSn", params.get(i).get("clturPhstrnActCtSn"));
			updateClturPhstrnActctRegMap.put("empId", params.get(i).get("empId"));

			commonService.queryIdDataControl(updateClturPhstrnActctRegMap);
		}




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
