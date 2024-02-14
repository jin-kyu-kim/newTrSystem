package com.trsystem.project.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.trsystem.common.service.CommonService;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Component
public class ProjectBaseDomain {
	
    private static CommonService commonService;
	
    @Autowired
	public ProjectBaseDomain(CommonService commonService) {
		ProjectBaseDomain.commonService = commonService;
	}

    public static boolean validMmnyHnfPrmpc(List<Map<String, Object>> mmnyLbrcoPrmpc){
        boolean result = false;

        try {

            Map<String, Object> param = new HashMap<>();
            String empId = mmnyLbrcoPrmpc.get(0).get("empId").toString();
            List<String> getYm = new ArrayList<>();
            for (Map<String, Object> map : mmnyLbrcoPrmpc) {
                getYm.add(map.get("inptYm").toString());
            }
            param.put("empId", empId);
            param.put("getYm", getYm);
            param.put("queryId", "project.validMmnyHnfPrmpc");

            List<Map<String, Object>> getData = commonService.queryIdSearch(param);

            if (getData.isEmpty()) {
                return true;
            }
        }catch (Exception ignored){
            return result;
        }
        return result;
    }
    
    public static int retrieveBgtMngOdr(List<Map<String, Object>> params) {
    	
    	if(params.get(1).get("bgtMngOdr") == null) return 1;
    	
    	try {
    		Map<String, Object> param = new HashMap<>();
    		
    		param.put("queryId", "projectMapper.retrieveBgtMngOdr");
    		param.put("prjctId", params.get(1).get("prjctId"));
    		
    		List<Map<String, Object>> result = commonService.queryIdSearch(param);
    		
    		if(result.size() > 0) {
    			return (int)result.get(0).get("bgtMngOdr");
    		} else {
    			return ((int)result.get(0).get("bgtMngOdr")) + 1;
    		}
    	} catch (Exception e) {
    		return -1;
    	}
    	
    }
    
    public static int insertProjectCostChg(List<Map<String, Object>> params, int bgtMngOdr) {
    	
    	if(params.get(1).get("bgtMngOdr") != null && params.get(1).get("bgtMngOdr").equals(bgtMngOdr)) {
    		return -1;
    	}
    	
    	params.get(1).put("bgtMngOdr", bgtMngOdr);
    	
    	try {
    		int result = commonService.insertData(params);
    		return result;
    		
    	} catch (Exception e) {
    		return -1;
    	}
    	
    }
    
    public static int insertRegistProjectAprv(List<Map<String, Object>> params) {
    	
    	String atrzSttsCd = "VTW00801";
    	List<Map<String, Object>> insertParams = new ArrayList<>();
    	
    	Map<String, Object> param = new HashMap<>();

    	param.put("atrzStepCd", "VTW00704");
    	param.put("regDt", params.get(1).get("regDt"));
    	param.put("atrzLnSn", 1);
    	param.put("atrzSttsCd", atrzSttsCd);
    	param.put("aprvrEmpId", params.get(1).get("empId"));
    	param.put("regEmpId", params.get(1).get("empId"));
    	param.put("prjctId", params.get(1).get("prjctId"));    	
    	
    	insertParams.add(0, params.get(0));
    	insertParams.add(1, param);
    	
    	try {
    		int result = commonService.insertData(insertParams);
    		return result;
    		
    	} catch (Exception e) {
    		return -1;
    	}
    	
    }
    
    public static List<Map<String, Object>> retrieveRegEmpId(Map<String, Object> params) {
    	
    	String deptId;
    	
    	List<Map<String, Object>> temp = new ArrayList<>();
    	
    	try {
    		Map<String, Object> param = new HashMap<>();
    		param.put("tbNm", "DEPT");
    		param.put("deptId", params.get("deptId"));
    		
    	} catch (Exception e) {
    	
    	}
    	
    	
    	List<Map<String, Object>> result = new ArrayList<>();
    	
    	
    
    	return result;
    }

}