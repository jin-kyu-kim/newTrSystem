package com.trsystem.information.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
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
public class InformationDomain {
	
	private static CommonService commonService;
	
	@Autowired
	public InformationDomain(CommonService commonService) {
		InformationDomain.commonService = commonService;
	}

	/**
	 * 전체이력조회출력 팝업 데이터 조회
	 * @param params
	 * @return
	 */
	 @Transactional
	    public static Map<String, Object> empInfoPopSearch(List<Map<String, Object>> params) {
	        Map<String, Object> resultMap = new HashMap<>();
	        
	        Map<String, Object> baseParam = new HashMap<>();
	        Map<String, Object> degreeParam = new HashMap<>();
	        Map<String, Object> languageParam = new HashMap<>();
	        Map<String, Object> licenseParam = new HashMap<>();
	        Map<String, Object> eduHistParam = new HashMap<>();
	        Map<String, Object> careerParam = new HashMap<>();
	        Map<String, Object> prjctHistParam = new HashMap<>();
	        
	        try {
	            for (Map<String, Object> param : params) {
	                String queryId = (String) param.get("queryId");
	                switch (queryId) {
	                	case "infoInqMapper.retrieveEmpBassInfo":
	                		baseParam = param;
	                	break;
	                    case "infoInqMapper.retrieveEmpAcbg":
	                    	degreeParam = param;
	                        break;
	                    case "infoInqMapper.retrieveFgggAblty":
	                    	languageParam = param;
	                        break;
	                    case "infoInqMapper.retrieveEmpQlfcLcns":
	                    	licenseParam = param;
	                        break;
	                    case "infoInqMapper.retrieveEmpEduHist":
	                    	eduHistParam = param;
	                        break;
	                    case "infoInqMapper.retrieveEmpCareer":
	                    	careerParam = param;
	                        break;
	                    case "infoInqMapper.retrievePrjctHist":
	                    	prjctHistParam = param;
	                        break;
	                    default:
	                        break;
	                }
	            }
	            
	            resultMap.put("BaseData", commonService.queryIdSearch(baseParam).get(0));
	            resultMap.put("EmpDegree", commonService.queryIdSearch(degreeParam));
	            resultMap.put("EmpLanguage", commonService.queryIdSearch(languageParam));
	            resultMap.put("EmpLicense", commonService.queryIdSearch(licenseParam));
	            resultMap.put("EmpEduHist", commonService.queryIdSearch(eduHistParam));
	            resultMap.put("EmpCareer", commonService.queryIdSearch(careerParam));
	            resultMap.put("PrjctHist", commonService.queryIdSearch(prjctHistParam));
	            
	        } catch (Exception e) {
	            e.printStackTrace(); 
	        }

	        return resultMap;
	    }
	
}