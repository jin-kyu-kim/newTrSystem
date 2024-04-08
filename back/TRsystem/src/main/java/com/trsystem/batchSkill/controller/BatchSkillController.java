package com.trsystem.batchSkill.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trsystem.batchSkill.service.BatchSkillService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BatchSkillController {
	
	private final BatchSkillService batchSkillService;
	
	//아무 화면에서 테스트용 버튼으로 axios 통신
/*	// front code
	  const promoTest = (e) => {

	    axios
	    .post("/boot/batchSkll/empPrmot", {
	        id : 'sytest',
	        jbps : 'VTW00111'
	    })
	    .then((response) => {
	      console.log("response");
	    })
	    .catch((errors) => {
	      console.log(errors);
	    });
	  }
*/
	@PostMapping(value = "/boot/batchSkll/empPrmot")
	public int executeEmpPrmot(@RequestBody Map<String, Object> params){
		return batchSkillService.prmotUpdateJBPS(params);
	}
	
	@PostMapping(value = "/boot/batchSkll/executeCostUpdate")
	public int executeCostUpdate() {
		return batchSkillService.executeCostUpdate();
	}

}
