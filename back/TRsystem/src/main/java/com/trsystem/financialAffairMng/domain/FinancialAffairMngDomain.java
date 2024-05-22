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

	@Transactional
	public static int updateClturPhstrnActct(List<Map<String, Object>> params) {
		Map<String, Object> changedValue = params.get(1);
		Map<String, Object> keyValue = (Map<String, Object>) params.get(2).get("clturPhstrnActCtSn,empId");

		// 기존 값 서치
		Map<String, Object> tbNm = new HashMap<>();
		tbNm.put("tbNm", "CLTUR_PHSTRN_ACT_CT_REG");
		List<Map<String, Object>> searchReg = new ArrayList<>();
		searchReg.add(tbNm);
		searchReg.add(keyValue);
		List<Map<String, Object>> regList = commonService.commonSelect(searchReg);
		Map<String, Object> regResult = regList.get(0);

		// 등록 테이블 업데이트
		List<Map<String, Object>> updateReg = new ArrayList<>();
		updateReg.add(params.get(0));
		updateReg.add(changedValue);
		updateReg.add(keyValue);
		commonService.updateData(updateReg);

		// 합계컬럼 서치
		tbNm.put("tbNm", "CLTUR_PHSTRN_ACT_CT");
		Map<String, Object> data = new HashMap<>();
		data.put("empId", keyValue.get("empId"));
		data.put("clturPhstrnActMngYm", regResult.get("clmYmd").toString().substring(0,6));
		List<Map<String, Object>> searchCt = new ArrayList<>();
		searchCt.add(tbNm);
		searchCt.add(data);
		List<Map<String, Object>> ctList = commonService.commonSelect(searchCt);
		Map<String, Object> ctResult = ctList.get(0);

		// 합계컬럼 업데이트: 청구금액
		Map<String, Object> updateCt = new HashMap<>();
		if(changedValue.containsValue("VTW00901") && changedValue.containsKey("clmAmt")){
			updateCt.put("ftnessTrngCtClmAmt", (int)ctResult.get("ftnessTrngCtClmAmt") - (int)regResult.get("clmAmt"));
			updateCt.put("clturCtClmAmt", (int)ctResult.get("clturCtClmAmt") + (int)changedValue.get("clmAmt"));
			updateCt.put("clmAmt", (int)ctResult.get("clmAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
		}
		else if (changedValue.containsValue("VTW00902") && changedValue.containsKey("clmAmt")) {
			updateCt.put("clturCtClmAmt", (int)ctResult.get("clturCtClmAmt") - (int)regResult.get("clmAmt"));
			updateCt.put("ftnessTrngCtClmAmt", (int)ctResult.get("ftnessTrngCtClmAmt") + (int)changedValue.get("clmAmt"));
			updateCt.put("clmAmt", (int)ctResult.get("clmAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
		}
		else if (changedValue.containsValue("VTW00901")) {
			updateCt.put("ftnessTrngCtClmAmt", (int)ctResult.get("ftnessTrngCtClmAmt") - (int)regResult.get("clmAmt"));
			updateCt.put("clturCtClmAmt", (int)ctResult.get("clturCtClmAmt") + (int)regResult.get("clmAmt"));
		}
		else if (changedValue.containsValue("VTW00902")) {
			updateCt.put("clturCtClmAmt", (int)ctResult.get("clturCtClmAmt") - (int)regResult.get("clmAmt"));
			updateCt.put("ftnessTrngCtClmAmt", (int)ctResult.get("ftnessTrngCtClmAmt") + (int)regResult.get("clmAmt"));
		}
		else if (changedValue.containsKey("clmAmt") && regResult.get("clturPhstrnSeCd").equals("VTW00901")) {
			updateCt.put("clturCtClmAmt", (int)ctResult.get("clturCtClmAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
			updateCt.put("clmAmt", (int)ctResult.get("clmAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
		}
		else if (changedValue.containsKey("clmAmt") && regResult.get("clturPhstrnSeCd").equals("VTW00902")) {
			updateCt.put("ftnessTrngCtClmAmt", (int)ctResult.get("ftnessTrngCtClmAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
			updateCt.put("clmAmt", (int)ctResult.get("clmAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
		}

		List<Map<String, Object>> ctParam = new ArrayList<>();
		ctParam.add(tbNm);
		ctParam.add(updateCt);
		ctParam.add(data);
		commonService.updateData(ctParam);

		// 다음달 합계컬럼 서치
		YearMonth yearMonth = YearMonth.parse((String)data.get("clturPhstrnActMngYm"), DateTimeFormatter.ofPattern("yyyyMM"));
		LocalDate nextMonth = yearMonth.atDay(1).plusMonths(1);
		data.put("clturPhstrnActMngYm", nextMonth.format(DateTimeFormatter.ofPattern("yyyyMM")));
		searchCt.add(data);
		List<Map<String, Object>> nextCtList = commonService.commonSelect(searchCt);
		Map<String, Object> nextCtResult = nextCtList.get(0);

		// 합계컬럼 업데이트: 이월금액
		Map<String, Object> nextCt = new HashMap<>();
		if(changedValue.containsValue("VTW00901") && changedValue.containsKey("clmAmt")){
			nextCt.put("ftnessTrngCtCyfdAmt", (int)nextCtResult.get("ftnessTrngCtCyfdAmt") - (int)regResult.get("clmAmt"));
			nextCt.put("clturCtCyfdAmt", (int)nextCtResult.get("clturCtCyfdAmt") + (int)changedValue.get("clmAmt"));
			nextCt.put("cyfdAmt", (int)nextCtResult.get("cyfdAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
		}
		else if (changedValue.containsValue("VTW00902") && changedValue.containsKey("clmAmt")) {
			nextCt.put("clturCtCyfdAmt", (int)nextCtResult.get("clturCtCyfdAmt") - (int)regResult.get("clmAmt"));
			nextCt.put("ftnessTrngCtCyfdAmt", (int)nextCtResult.get("ftnessTrngCtCyfdAmt") + (int)changedValue.get("clmAmt"));
			nextCt.put("cyfdAmt", (int)nextCtResult.get("cyfdAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
		}
		else if (changedValue.containsValue("VTW00901")) {
			nextCt.put("ftnessTrngCtCyfdAmt", (int)nextCtResult.get("ftnessTrngCtCyfdAmt") - (int)regResult.get("clmAmt"));
			nextCt.put("clturCtCyfdAmt", (int)nextCtResult.get("clturCtCyfdAmt") + (int)regResult.get("clmAmt"));
		}
		else if (changedValue.containsValue("VTW00902")) {
			nextCt.put("clturCtCyfdAmt", (int)nextCtResult.get("clturCtCyfdAmt") - (int)regResult.get("clmAmt"));
			nextCt.put("ftnessTrngCtCyfdAmt", (int)nextCtResult.get("ftnessTrngCtCyfdAmt") + (int)regResult.get("clmAmt"));
		}
		else if (changedValue.containsKey("clmAmt") && regResult.get("clturPhstrnSeCd").equals("VTW00901")) {
			nextCt.put("clturCtCyfdAmt", (int)nextCtResult.get("clturCtCyfdAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
			nextCt.put("cyfdAmt", (int)nextCtResult.get("cyfdAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
		}
		else if (changedValue.containsKey("clmAmt") && regResult.get("clturPhstrnSeCd").equals("VTW00902")) {
			nextCt.put("ftnessTrngCtCyfdAmt", (int)nextCtResult.get("ftnessTrngCtCyfdAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
			nextCt.put("cyfdAmt", (int)nextCtResult.get("cyfdAmt") - (int)regResult.get("clmAmt") + (int)changedValue.get("clmAmt"));
		}

		List<Map<String, Object>> nextParam = new ArrayList<>();
		nextParam.add(tbNm);
		nextParam.add(nextCt);
		nextParam.add(data);
		int result = commonService.updateData(nextParam);

		return result;
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
	public static int saveDpstAmt(List<Map<String, Object>> param) {
		for (int i = 0; i < param.size(); i++){
			param.get(i).put("queryId", "financialAffairMngMapper.saveDpstAmt");
			param.get(i).put("state", "UPDATE");
			YearMonth yearMonth = YearMonth.parse((String)param.get(i).get("ym"), DateTimeFormatter.ofPattern("yyyyMM"));
			LocalDate nextMonth = yearMonth.atDay(1).plusMonths(1);
			param.get(i).put("nextMonth", nextMonth.format(DateTimeFormatter.ofPattern("yyyyMM")));
			commonService.queryIdDataControl(param.get(i));
			param.get(i).put("queryId", "financialAffairMngMapper.saveDpstAmtNextMonth");
			commonService.queryIdDataControl(param.get(i));
		}
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


	public static List<Map<String, Object>> retrievePrjctCtClmYMDAccto(Map<String, Object>param){
		List<Map<String, Object>> result = new ArrayList<>();
		Map<String, Object> searchParam = new HashMap<>(param);
		searchParam.put("queryId", "financialAffairMngMapper.retrievePrjctCtClmgetEmp");

		List<Map<String, Object>> getCost = commonService.queryIdSearch(searchParam);
		List<Map<String, Object>> getData;
		for(Map<String, Object> data : getCost){
			param.put("empId", data.get("empId").toString());
			getData = commonService.queryIdSearch(param);
			for(Map<String, Object> cdVal: getData){
				cdVal.putAll(data);
				result.add(cdVal);
			}
		}
		return result;
	}
	
}
