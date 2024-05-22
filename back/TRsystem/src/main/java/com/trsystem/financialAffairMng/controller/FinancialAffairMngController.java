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

	@PostMapping(value = "/boot/financialAffairMng/updateClturPhstrnActct")
	public int updateClturPhstrnActct(@RequestBody List<Map<String, Object>> params) {
		return FinancialAffairMngDomain.updateClturPhstrnActct(params);
	}
	
	@PostMapping(value = "/boot/financialAffairMng/updateDpstAmt")
	public int updateDpstAmt(@RequestBody Map<String, Object> param) {
		return FinancialAffairMngDomain.updateDpstAmt(param);
	}

	@PostMapping(value = "/boot/financialAffairMng/saveDpstAmt")
	public int saveDpstAmt(@RequestBody List<Map<String, Object>> param) {
		return FinancialAffairMngDomain.saveDpstAmt(param);
	}

	@PostMapping(value = "/boot/financialAffairMng/cancelMmCtAtrz")
	public int cancelCtAply(@RequestBody List<List<Map<String, Object>>> paramList) {
		return FinancialAffairMngDomain.cancelMmCtAtrz(paramList);
	}
	@PostMapping(value = "/boot/financialAffairMng/retrievePrjctCtClmYMDAccto")
	public List<Map<String, Object>> retrievePrjctCtClmYMDAccto(@RequestBody Map<String, Object> param) {
		return FinancialAffairMngDomain.retrievePrjctCtClmYMDAccto(param);
	}
}
