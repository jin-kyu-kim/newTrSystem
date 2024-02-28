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
    	int fail = -1;
    	
    	List<Map<String, Object>> insertParams = new ArrayList<>();
    	Map<String, Object> param = new HashMap<>();
    	param.put("prjctId", params.get(1).get("prjctId"));
    	param.put("totAltmntBgt", params.get(1).get("totAltmntBgt"));
    	param.put("atrzDmndSttsCd", params.get(1).get("atrzDmndSttsCd"));
    	param.put("regDt", params.get(1).get("regDt"));
    	
    	
    	insertParams.add(params.get(0));
    	
    	try {
    		
	    	if(params.get(1).get("bgtMngOdr") == null) {
	    		
	    		if(bgtMngOdr == 0) { // 최초 생성 시 1로 insert
	    			param.put("bgtMngOdr", 1);
	    			insertParams.add(param);
	    			
	        		commonService.insertData(insertParams);
	        		return 1;
	    		} else {
	    			// 0이 아니란건 일단 insert 되었다는 것. 
	    			// 삽입하면 안된다.
	    			return bgtMngOdr;
	    		}
	    		
	    	} else {
	    		// 승인된 차수가 1개 이상 존재한다는 뜻
	    		if(Integer.parseInt(String.valueOf(params.get(1).get("bgtMngOdr"))) == bgtMngOdr) {
	    			bgtMngOdr += 1;
	    			param.put("bgtMngOdr", bgtMngOdr);
	    			insertParams.add(param);
	    			
	        		commonService.insertData(insertParams);
	        		return bgtMngOdr;
	    		} else {
	    			return bgtMngOdr;
	    		}
	    	}
    	} catch (Exception e) {
    		return fail;
    	}
    	
    	
//    	
//    	// Detail 화면에서 받은 params 에 들어있는 차수와 채번한 차수를 비교한다.
//    	if(params.get(1).get("bgtMngOdr") != null && Integer.parseInt(String.valueOf(params.get(1).get("bgtMngOdr"))) == bgtMngOdr) {
//    		targetOdr = bgtMngOdr + 1;
//    	} else {
//    		targetOdr = bgtMngOdr;
//    	}
//    	
//    	params.get(1).put("bgtMngOdr", targetOdr);
//    	
//    	try {
//    		result = commonService.insertData(params);
//    		
//    	} catch (Exception e) {
//    		return result;
//    	}
//    	
//    	if(result > 0) {
//    		return targetOdr;
//    	} 
//    	return result;
    	
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

	public static List<Map<String, Object>> updateChgPrmpcMdfcn(List<Object> params) {
		List<Map<String, Object>> result = new ArrayList<>();
		
		List<Map<String, Object>> updateColumns = (List<Map<String, Object>>) params.get(2);
		
		for(int i=0; i < updateColumns.size(); i++) {
					
			List<Map<String, Object>> updateParams = new ArrayList<>();
			Map<String, Object> updateColumn = updateColumns.get(i);
						
			updateParams.add(0, (Map<String, Object>) params.get(0));
			updateParams.add(1, (Map<String, Object>) params.get(1));
			updateParams.add(2, (Map<String, Object>) updateColumn);
			updateParams.add(3, (Map<String, Object>) params.get(3));		
			
			Map<String, Object> param = new HashMap<>();	//Merge문 던질 파람
			
			for (Map<String, Object> currentMap : updateParams) {
				param.putAll(currentMap);
			}
			System.out.println("param"+param);		
			result = commonService.queryIdSearch(param);		
		}	
		return result;
	}


	public static int saveOutordEntrpsPrmpc(List<Object> params) {
		int result = 0;
		int dtlResult = 0;

		Map<String, Object> tableInfo =  (Map<String, Object>) params.get(0);
		Map<String, Object> insertSet =  (Map<String, Object>) params.get(1);
		List<Map<String, Object>> insertParams = new ArrayList<>();		// PRJCT_ATRZ_LN
    	List<Map<String, Object>> insertDtlParams = new ArrayList<>();	// PRJCT_ATRZ_LN_DTL
    	
    	
    	Map<String, Object> mainTable = new HashMap<>();
    	mainTable.put("tbNm", tableInfo.get("tbNm"));
    	
    	Map<String, Object> mainInfo = new HashMap<>();
    	mainInfo.put("outordEntrpsCtPrmpcSn", 2);
    	mainInfo.put("prjctId", insertSet.get("prjctId"));
    	mainInfo.put("bgtMngOdr", insertSet.get("bgtMngOdr"));
    	mainInfo.put("outordEntrpsId", insertSet.get("outordEntrpsId"));
    	mainInfo.put("tkcgJob", insertSet.get("tkcgJob"));
    	mainInfo.put("dtlDtls", insertSet.get("dtlDtls"));
    	mainInfo.put("dtlDtls", insertSet.get("dtlDtls"));
    	
		insertParams.add(0, mainTable);
		insertParams.add(1, mainInfo);
		
		
    	Map<String, Object> subTable = new HashMap<>();
    	subTable.put("tbNm", tableInfo.get("subTbNm"));
    	
    	Map<String, Object> subInfo = new HashMap<>();
    	subInfo.put("outordEntrpsCtPrmpcSn", 2);
    	subInfo.put("prjctId", insertSet.get("prjctId"));
    	subInfo.put("bgtMngOdr", insertSet.get("bgtMngOdr"));
    	subInfo.put("giveYm", insertSet.get("giveYm"));
    	subInfo.put("expectCt", insertSet.get("expectCt"));
    	
    	insertDtlParams.add(0,subTable);
    	insertDtlParams.add(1,subInfo);
    	
    	System.out.println("###### insertParams"+ insertParams);
		System.out.println("###### insertDtlParams"+ insertDtlParams);
		
		
		try {
    		
    		result =  commonService.insertData(insertParams);
    		dtlResult = commonService.insertData(insertDtlParams);
    		
    	} catch(Exception e) {
    		
    
    	}
		
    	return result;
	}

}