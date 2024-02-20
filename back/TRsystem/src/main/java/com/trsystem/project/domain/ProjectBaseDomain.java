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
    	
    	int result = 0;

    	final String PRJCT_ID = (String) params.get(2).get("prjctId");
    	
    	Map<String, Object> param = new HashMap<>();
      	param.put("prjctId", PRJCT_ID);
      	param.put("atrzLnSn", params.get(2).get("atrzLnSn"));
    	param.put("regDt", params.get(2).get("regDt"));
    	param.put("regEmpId", params.get(2).get("empId"));
      	
    	if((int)param.get("atrzLnSn") == 1) {
    		param.put("prmpcInptSeCd", "VTW01502"); // 최초 시 원가 등록(VTW01502)
    	} else {
    		param.put("prmpcInptSeCd", "VTW01503"); // 최초가 아닐 시 원가 변경(VTW01503)
    	}
    	
    	param.put("atrzAplyPrvonshCn", params.get(2).get("atrzAplyPrvonshCn"));
    	
    	try {
    		
        	List<Map<String, Object>> insertParams = new ArrayList<>();
    		insertParams.add(0, params.get(0));
    		insertParams.add(1, param);
    		
    		System.out.println(insertParams);
    		
    		result = commonService.insertData(insertParams);
    		
    	} catch(Exception e) {
    		return result;
    	}
    	return result;
    }
    
    public static int insertRegistProjectAprvDtl(List<Map<String, Object>> params, List<Map<String, Object>> empIdParams) {
    	
    	int result = 0;
    	
    	List<Map<String, Object>> insertParams = new ArrayList<>();
    	
    	final String PRJCT_ID = (String) params.get(2).get("prjctId");
    	final String atrzSttsCd = "VTW00801";
    	String atrzStepCd[] = {"VTW00705", "VTW00704", "VTW00703", "VTW00702", "VTW00701"};
    	
    	insertParams.add(0, params.get(1));
    	
    	for(int i = 0; i < empIdParams.size(); i++) {
        	Map<String, Object> param = new HashMap<>();
        	
        	// 공통되는 부분
          	param.put("prjctId", PRJCT_ID);
        	param.put("atrzLnSn", params.get(2).get("atrzLnSn"));
        	param.put("regDt", params.get(2).get("regDt"));
        	param.put("regEmpId", params.get(2).get("empId"));
        	param.put("atrzSttsCd", atrzSttsCd);
    		
        	// 다른 부분
    		param.put("atrzStepCd", atrzStepCd[i]);
    		param.put("aprvrEmpId", empIdParams.get(i).get("empId"));
    		
    		insertParams.add(i+1, param);
    	}
    	
    	try {
    		
    		result = commonService.insertData(insertParams);
    		
    	} catch (Exception e) {
    		return result;
    	}
    	return result;
    }
    
    
    /*
     * 승인 순번 채번 메소드
     */
    public static int retrievePrjctAtrzLnSn(Map<String, Object> param) {
    	
    	int atrzLnSn = 1;
    	System.out.println(param);
    	
    	List<Map<String, Object>> atrzLnSnResult = new ArrayList<>();
    	
      	try {
      		
          	Map<String, Object> snParam = new HashMap<String, Object>();
          	snParam.put("queryId", "projectMapper.retrievePrjctAtrzLnSn");
          	snParam.put("prjctId", param.get("prjctId"));
          	
          	atrzLnSnResult = commonService.queryIdSearch(snParam);
          	
          	
          	if(atrzLnSnResult.get(0) != null) {
          		atrzLnSn = (int)atrzLnSnResult.get(0).get("atrzLnSn") + 1;
          	} else {
          		return atrzLnSn;
          	}
          	
      		return atrzLnSn;
      	} catch (Exception e) {
      		e.printStackTrace();
      		return -1;
      	}
      	
    	
    }
    
    public static List<Map<String, Object>> retrieveAprvrEmpId(Map<String, Object> params) {
    	
    	String deptId;
    	
    	final String queryId = "projectMapper.retrieveAprvrEmpId";
    	
    	// 2. deptId로 결재자(팀장급)의 Id를 찾는다.
    	List<Map<String, Object>> aprvrEmpIdlist = new ArrayList<>();
    	Map<String, Object> queryIdMap = new HashMap<>();
    	queryIdMap.put("queryId", queryId);
    	
    	try {
    		// 1. 나의 deptId를 찾는다. 
    		List<Map<String, Object>> commonSelectParams = new ArrayList<>();
    		
    		Map<String, Object> tbNm = new HashMap<>();
    		tbNm.put("tbNm", "DEPT_HNF");

    		Map<String, Object> condition = new HashMap<>();
    		condition.put("empId", params.get("empId"));
    		
    		commonSelectParams.add(tbNm);
    		commonSelectParams.add(condition);
    		
    		deptId = (String) commonService.commonSelect(commonSelectParams).get(0).get("deptId");
    		
    		queryIdMap.put("deptId", deptId);
    		
    		// 2. deptId에 해당하는 계층쿼리를 조회한다.
    		aprvrEmpIdlist = commonService.queryIdSearch(queryIdMap);
    		
    	} catch (Exception e) {
    		
    	}
    	
    	return aprvrEmpIdlist;
    	
    }
    

}