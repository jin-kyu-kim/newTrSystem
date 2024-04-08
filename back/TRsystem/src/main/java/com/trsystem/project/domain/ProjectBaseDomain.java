package com.trsystem.project.domain;

import com.trsystem.batchSkill.service.BatchSkillService;
import com.trsystem.common.service.CommonService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@Component
public class ProjectBaseDomain {
	
    private static CommonService commonService;
	private static BatchSkillService batchSkillService;
    
    @Autowired
	public ProjectBaseDomain(CommonService commonService, BatchSkillService batchSkillService) {
		ProjectBaseDomain.commonService = commonService;
		ProjectBaseDomain.batchSkillService = batchSkillService;
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
	    			int bgtMngOdrTobe = bgtMngOdr + 1;
	    			param.put("bgtMngOdr", bgtMngOdrTobe);
	    			insertParams.add(param);
	    			
	        		commonService.insertData(insertParams);
	        		
	        		// bgtMngOdr에 해당하는 차수의 예산 값들을 bgtMngOdrTobe에 copy 해준다.
	        		batchSkillService.executeAddPrjctBgtPrmpc(String.valueOf(params.get(1).get("prjctId")), bgtMngOdr, bgtMngOdrTobe);
	        		
	        		return bgtMngOdrTobe;
	    		} else {
	    			return bgtMngOdr;
	    		}
	    	}
    	} catch (Exception e) {
    		return fail;
    	}
    	
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
    	aprvParam.put("bgtMngOdr", params.get(2).get("targetOdr")); // 승인받는 변경차수 

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
        	
        	if(i == empIdParams.size() - 1) {
        		
        		aprvDtlParam.put("atrzSttsCd", atrzSttsCd);
        	} else {
        		aprvDtlParam.put("atrzSttsCd", "VTW00806");
        	}
    		
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

    /**
     * 결재자 EmpId 계층 쿼리 조회
     * @param params
     * @return
     */
    public static List<Map<String, Object>> retrieveAprvrEmpId(Map<String, Object> params) {
    	
    	final String queryId = "projectMapper.retrieveAprvrEmpId";
    	
    	List<Map<String, Object>> aprvrEmpIdlist = new ArrayList<>();
    	Map<String, Object> queryIdMap = new HashMap<>();
    	
    	queryIdMap.put("queryId", queryId);
    	
    	// 1. deptId가 없는 경우 가져오기.
    	Map<String, Object> tbParam = new HashMap<>();
    	Map<String, Object> infoParam = new HashMap<>();
    	List<Map<String, Object>> selectParams = new ArrayList<>();
    	
    	
    	
    	// deptId가 null일 경우 프로젝트에서 직접 찾는다.
    	if(String.valueOf(params.get("deptId")).equals("null") || String.valueOf(params.get("deptId")).equals(null)) {
    		
    		tbParam.put("tbNm", "PRJCT");
    		infoParam.put("prjctId", params.get("prjctId"));
    		
    		selectParams.add(0, tbParam);
    		selectParams.add(infoParam);
    		
    		List<Map<String, Object>> result = commonService.commonSelect(selectParams);
    		
    		System.out.println(result.get(0));
    		
    		queryIdMap.put("deptId", result.get(0).get("deptId"));
    	} else {
    		
    		queryIdMap.put("deptId", params.get("deptId"));
    	}
    	


    	
    	try {
        	// 2. deptId로 결재자(팀장급)의 Id를 찾는다.
    		// 넘겨받은 deptId = 프로젝트가 속한 부서의 deptId.
    		// deptId에 해당하는 계층쿼리를 조회한다.
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
	
	/**
	 * 변경차수가 반려일 경우 초기화를 선택하였을 때
//	 * @param params
	 */
	public static int resetPrmpc(Map<String, Object> param) {
		int result = 0;
		int aprvBgtMngOdr = 0;
		int bgtMngOdrTobe = Integer.parseInt(String.valueOf(param.get("bgtMngOdrTobe")));
		
		// 승인된 차수가 존재하는 경우에 승인된 차수 따로 빼둬서 데이터를 넣을 때 사용한다.
		if(param.get("bgtMngOdr") != null) {
			aprvBgtMngOdr = Integer.parseInt(String.valueOf(param.get("bgtMngOdr")));
		}
		
    	List<Map<String, Object>> insertParams = new ArrayList<>();
    	Map<String, Object> tbParam = new HashMap<>();
    	Map<String, Object> infoParam = new HashMap<>();
    	
    	tbParam.put("tbNm", "PRJCT_BGT_PRMPC");
    	insertParams.add(0, tbParam);
    	
    	infoParam.put("prjctId", param.get("prjctId"));
    	infoParam.put("totAltmntBgt", param.get("totAltmntBgt"));
    	infoParam.put("regDt", param.get("regDt"));
    	infoParam.put("regEmpId", param.get("regEmpId"));
    	infoParam.put("atrzDmndSttsCd", param.get("atrzDmndSttsCd"));
    	
    	// 새로운 차수를 생성하도록 한다.
		infoParam.put("bgtMngOdr", bgtMngOdrTobe + 1);

		System.out.println(infoParam);
		try {
	    	insertParams.add(1, infoParam);
	    	result = commonService.insertData(insertParams);
	    	
	    	// 승인된 차수가 없을 경우 생성 후 마친다.
	    	if(aprvBgtMngOdr > 0 && result > 0) {
	    		
	    		// 승인된 차수의 예산 값들을 새로 만들어진 차수에 copy 해준다.
	    		batchSkillService.executeAddPrjctBgtPrmpc(String.valueOf(param.get("prjctId")), aprvBgtMngOdr, bgtMngOdrTobe + 1);
	    	}
	    	
	    	return bgtMngOdrTobe + 1;
		} catch (Exception e) {
	    	return result;
		}
	}

	public static List<Map<String, Object>> retrievePjrctCost(Map<String, Object>param){
		List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> searchParam = new HashMap<>(param);
		searchParam.put("queryId", "projectMapper.retrievedistinctCost");

		//원가 비용코드값 수
		List<Map<String, Object>> getCost = commonService.queryIdSearch(searchParam);

		List<Map<String, Object>> getData;
		for(Map<String, Object> data : getCost){
			param.put("expensCd", data.get("expensCd").toString());
			param.put("expensNm", data.get("expensNm").toString());
			getData = commonService.queryIdSearch(param);
			for(Map<String, Object> cdVal: getData){
				cdVal.putAll(data);
				result.add(cdVal);
			}
		}
		return result;
	}

	public static List<Map<String, Object>> retrievePjrctEmpCost(Map<String, Object>param){
		List<Map<String, Object>> result = new ArrayList<>();
		Map<String, Object> searchParam = new HashMap<>(param);
		searchParam.put("queryId", "projectMapper.retrievedistinctEmpCost");

		List<Map<String, Object>> getCost = commonService.queryIdSearch(searchParam);
		List<Map<String, Object>> getData;
		for(Map<String, Object> data : getCost){
			param.put("empId", data.get("empId").toString());
			getData = commonService.queryIdSearch(param);
			for(Map<String, Object> cdVal: getData){
				cdVal.putAll(data);
				result.add(cdVal);
			}
		}
		return result;
	}
	public static List<Map<String, Object>> retrievePjrctOutordEmpCost(Map<String, Object>param){
		List<Map<String, Object>> result = new ArrayList<>();
		Map<String, Object> searchParam = new HashMap<>(param);
		searchParam.put("queryId", "projectMapper.retrievePjrctOutordEmpCost");

		List<Map<String, Object>> getCost = commonService.queryIdSearch(searchParam);
		List<Map<String, Object>> getData;
		for(Map<String, Object> data : getCost){
			param.put("outordEmpId", data.get("outordEmpId").toString());
			getData = commonService.queryIdSearch(param);
			for(Map<String, Object> cdVal: getData){
				cdVal.putAll(data);
				result.add(cdVal);
			}
		}
		return result;
	}
	
	public static String aprvPrjctAtrz(List<Map<String, Object>> paramList) {
		
		// 현재 승인자
		String aprvrEmpId = String.valueOf(paramList.get(2).get("aprvrEmpId"));
		
		// 현재 승인자의 결재 단계
		String atrzStepCd = String.valueOf(paramList.get(2).get("atrzStepCd"));

		int uptResult = -1;

		
		Map<String, Object> selectParam = new HashMap<>();
		selectParam.put("queryId", "projectMapper.retrievePrjctAtrzLn");
		selectParam.put("prjctId", paramList.get(2).get("prjctId"));
		selectParam.put("atrzLnSn", paramList.get(2).get("atrzLnSn"));
		selectParam.put("atrzStepCd", atrzStepCd);
		List<Map<String, Object>> atrzLine = commonService.queryIdSearch(selectParam);
		
		try {
			// update 해준다.

			for(int i = 0; i < atrzLine.size(); i++) {
				
				Map<String, Object> updateParam = new HashMap<>();
				Map<String, Object> conditionParam = new HashMap<>();
				List<Map<String, Object>> updateParams = new ArrayList<>();
				
				if(String.valueOf(atrzLine.get(i).get("atrzStepCd")).equals(atrzStepCd) && 
					String.valueOf(atrzLine.get(i).get("aprvrEmpId")).equals(aprvrEmpId)) {
					// 라인의 단계와 현재 단계가 같으면서 현재 결재자가 같은 경우에 결재선 승인함.
					System.out.println(atrzLine.get(i));
					System.out.println(atrzStepCd);
					
					updateParams.add(0, paramList.get(0));	// 업데이트할 타겟 테이블
					updateParams.add(1, paramList.get(1));	// 업데이트할 테이블의 내용

					
					updateParam.put("prjctId", paramList.get(2).get("prjctId"));
					updateParam.put("atrzLnSn", paramList.get(2).get("atrzLnSn"));
					updateParam.put("aprvrEmpId", aprvrEmpId);
					updateParam.put("atrzStepCd", atrzStepCd);
					
					updateParams.add(2, updateParam);
					
					uptResult = commonService.updateData(updateParams);
					
					if(uptResult < 0) {
						return null;
					}
					
					switch(atrzStepCd) {
					case "VTW00701" : 
						atrzStepCd = "VTW00702"; 
						break;
					case "VTW00702":
						atrzStepCd = "VTW00703";
						break;
					case "VTW00703":
						atrzStepCd = "VTW00704";
						break;
					case "VTW00704":
						atrzStepCd = "VTW00705";
						break;
					case "VTW00705":
						atrzStepCd = "VTW00708";
						break;
					}
					
				} else {
					updateParams.add(0, paramList.get(0));	// 업데이트할 타겟 테이블
					
					conditionParam.put("atrzStepCd", atrzStepCd);
					conditionParam.put("prjctId", paramList.get(2).get("prjctId"));
					conditionParam.put("atrzLnSn", paramList.get(2).get("atrzLnSn"));
					
					updateParam.put("atrzSttsCd", "VTW00801");
					
					updateParams.add(1, updateParam); // 업데이트할 정보
					updateParams.add(2, conditionParam); // 업데이트할 테이블의 조건
					
					
					uptResult = commonService.updateData(updateParams);
				}
				
			}

			
		} catch (Exception e) {
			return null;
		}
		
		return atrzStepCd;
	}

}