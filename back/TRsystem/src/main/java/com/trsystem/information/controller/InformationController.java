package com.trsystem.information.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trsystem.information.domain.InformationDomain;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class InformationController {

	/**
	 * 개인정보관리 전체이력조회 팝업의 정보 조회
	 * @param params
	 * @return
	 */
	  @PostMapping(value = "/boot/informaiton/empInfo")
	    public Map<String, Object> mainSearch(@RequestBody List<Map<String, Object>> params) {
	    	return InformationDomain.empInfoPopSearch(params);
	    }
}
