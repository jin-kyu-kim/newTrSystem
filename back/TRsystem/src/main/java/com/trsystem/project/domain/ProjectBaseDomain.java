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
    	
    	try {
    		Map<String, Object> param = new HashMap<>();
    		
    		param.put("queryId", "projectMapper.retrieveBgtMngOdr");
    		param.put("prjctId", params.get(1).get("prjctId"));
    		
    		List<Map<String, Object>> result = commonService.queryIdSearch(param);
    		
			return Integer.parseInt(String.valueOf(result.get(0).get("bgtMngOdr")));
    	} catch (Exception e) {
    		e.printStackTrace();
    		return -1;
    	}
    	
    }
    
    public static int insertProjectCostChg(List<Map<String, Object>> params, int bgtMngOdr) {
    	
    	int targetOdr;
    	int result = -1;
    	
    	// Detail 화면에서 받은 params 에 들어있는 차수와 채번한 차수를 비교한다.
    	if(params.get(1).get("bgtMngOdr") != null && Integer.parseInt(String.valueOf(params.get(1).get("bgtMngOdr"))) == bgtMngOdr) {
    		targetOdr = bgtMngOdr + 1;
    	} else {
    		targetOdr = bgtMngOdr;
    		return targetOdr;
    	}
    	
    	params.get(1).put("bgtMngOdr", targetOdr);
    	
    	try {
    		result = commonService.insertData(params);
    		
    	} catch (Exception e) {
    		return result;
    	}
    	
    	if(result > 0) {
    		return targetOdr;
    	} 
    	return result;
    	
    }
    
    public static int insertRegistProjectAprv(List<Map<String, Object>> params, List<Map<String, Object>> empIdParams) {
    	
    	int result = 0;
    	int dtlResult = 0;
    	
    	final String PRJCT_ID = (String) params.get(2).get("prjctId");
    	final String atrzSttsCd = "VTW00801";
    	String atrzStepCd[] = {"VTW00705", "VTW00704", "VTW00703", "VTW00702", "VTW00701"};
    	
    	List<Map<String, Object>> insertParams = new ArrayList<>();		// PRJCT_ATRZ_LN
    	List<Map<String, Object>> insertDtlParams = new ArrayList<>();	// PRJCT_ATRZ_LN_DTL
    	
    	
    	// PRJCT_ATRZ_LN insert용 parameter 생성
    	Map<String, Object> aprvParam = new HashMap<>();	
    	aprvParam.put("prjctId", PRJCT_ID);
    	aprvParam.put("atrzLnSn", params.get(2).get("atrzLnSn"));
    	aprvParam.put("regDt", params.get(2).get("regDt"));
    	aprvParam.put("regEmpId", params.get(2).get("empId"));
    	aprvParam.put("atrzAplyPrvonshCn", params.get(2).get("atrzAplyPrvonshCn"));
    	aprvParam.put("nowAtrzStepCd", atrzStepCd[empIdParams.size()-1]); // 최초 생성 시 현재 결재단계는 가장 낮은 단계 등록

    	if((int)aprvParam.get("atrzLnSn") == 1) {
    		aprvParam.put("prmpcInptSeCd", "VTW01502"); // 최초 시 원가 등록(VTW01502)
    	} else {
    		aprvParam.put("prmpcInptSeCd", "VTW01503"); // 최초가 아닐 시 원가 변경(VTW01503)
    	}

    	insertParams.add(0, params.get(0));
    	insertParams.add(1, aprvParam);
    	
    	
    	// PRJCT_ATRZ_LN_DTL insert용 parameter 생성
    	insertDtlParams.add(0, params.get(1));
    	for(int i = 0; i < empIdParams.size(); i++) {
        	Map<String, Object> aprvDtlParam = new HashMap<>();
        	
        	// 공통되는 부분
        	aprvDtlParam.put("prjctId", PRJCT_ID);
        	aprvDtlParam.put("atrzLnSn", params.get(2).get("atrzLnSn"));
        	aprvDtlParam.put("regDt", params.get(2).get("regDt"));
        	aprvDtlParam.put("regEmpId", params.get(2).get("empId"));
        	aprvDtlParam.put("atrzSttsCd", atrzSttsCd);
    		
        	// 다른 부분
        	aprvDtlParam.put("atrzStepCd", atrzStepCd[i]);
        	aprvDtlParam.put("aprvrEmpId", empIdParams.get(i).get("empId"));
    		
    		insertDtlParams.add(i+1, aprvDtlParam);
    	}
    	
    	try {
    		
    		result = commonService.insertData(insertParams);
    		dtlResult = commonService.insertData(insertDtlParams);
    		
    	} catch(Exception e) {
    		return result;
    	}
    	return result * dtlResult;
    }
    
    /*
     * 승인 순번 채번 메소드
     */
    public static int retrievePrjctAtrzLnSn(Map<String, Object> param) {
    	
    	int atrzLnSn = 1;
    	
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