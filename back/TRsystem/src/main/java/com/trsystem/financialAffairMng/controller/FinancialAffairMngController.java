package com.trsystem.financialAffairMng.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trsystem.financialAffairMng.domain.FinancialAffairMngDomain;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FinancialAffairMngController {

	@PostMapping(value = "/boot/financialAffairMng/retrieveCtData")
	public List<Map<String, Object>> retrieveCtData(@RequestBody Map<String, Object> params) {
		
		return FinancialAffairMngDomain.retrieveCtData(params);
	}

	@PostMapping(value = "/boot/financialAffairMng/updateDpstAmt")
	public int updateDpstAmt(@RequestBody Map<String, Object> param) {
		return FinancialAffairMngDomain.updateDpstAmt(param);
	}
}
