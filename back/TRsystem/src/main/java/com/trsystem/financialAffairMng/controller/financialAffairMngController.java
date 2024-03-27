package com.trsystem.financialAffairMng.controller;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.trsystem.common.service.CommonService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class financialAffairMngController {

    private final CommonService commonService;


	@PostMapping(value = "/boot/retrieveFnnrMngWorkHrCtUnityAprv")
	public List<Map<String, Object>> selectAprvList(@RequestBody Map<String, Object> params) {
        List<Map<String, Object>> workHrCtUnityAprvList = new ArrayList<>();


        Map<String, Object> param = new HashMap<String, Object>();
        param.put("queryId", "financialAffairMngMapper.retrieveWorkHrAprvList");
//        param.put("prjctId", param.get("prjctId"));



        List<Map<String, Object>> workHrAprvList = commonService.queryIdSearch(param);
//        List<Map<String, Object>> ctUnitAprvList = commonService.queryIdSearch(params);
        for(int i=0 ; i < workHrAprvList.size(); i++){
            workHrCtUnityAprvList.add(workHrAprvList.get(i));
            System.out.println("이것의 결과는" + workHrCtUnityAprvList.get((i)));
        }



        return workHrCtUnityAprvList;
	}
}
