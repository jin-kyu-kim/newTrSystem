package com.trsystem.project.controller;

import com.trsystem.project.domain.ProjectBaseDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProjectBaseController {

    //프로젝트 관리 변경원가 등록 시 프로젝트예산원가 생성 
    @PostMapping(value = "/boot/prjct/insertProjectCostChg")
    public int insertProjectCostChg(@RequestBody List<Map<String, Object>> params) {
    	
    	// 예산관리 차수 채번
    	int bgtMngOdr = ProjectBaseDomain.retrieveBgtMngOdr(params);
    	// 예산관리 차수 채번 실패 시
    	if(bgtMngOdr == -1) return -1;
    	
    	return ProjectBaseDomain.insertProjectCostChg(params, bgtMngOdr);
    }
    
    
    @PostMapping(value = "/boot/prjct/insertRegistProjectAprv")
    public int insertRegistProjectAprv(@RequestBody List<Map<String, Object>> params) {
    	// front로 부터 받은 params -> 기초적인 정보들 (ex. prjctId, regDt 등)
    	// 조회 로직을 하나 추가하여, 프로젝트 결재선 테이블에 넣을 값들을 조회한 뒤 insert 메소드에 매개변수로 함께 넘겨준다.
    	List<Map<String, Object>> empIdParams = new ArrayList<>();
    	
    	int result = 0;
    	
    	// 채번한다
    	int atrzLnSn = ProjectBaseDomain.retrievePrjctAtrzLnSn(params.get(2));
    	
    	if(atrzLnSn < 0) {
    		return atrzLnSn;
    	}
   
    	// 결재선을 만드는 메소드를 호출한다.
    	empIdParams = ProjectBaseDomain.retrieveAprvrEmpId(params.get(2));
    	if(empIdParams.size() > 0) {
    		    		
    		params.get(2).put("atrzLnSn", atrzLnSn);
    		
    		result = ProjectBaseDomain.insertRegistProjectAprv(params, empIdParams);
    		
    	}
    	
    	return result;
    }
    
    @PostMapping(value = "/boot/prjct/updateChgPrmpcMdfcn")
    public List<Map<String, Object>> updateChgPrmpcMdfcn(@RequestBody List<Object> params) {
    
    	List<Map<String, Object>> result = ProjectBaseDomain.updateChgPrmpcMdfcn(params);
    	
    	return result;
    }
   
    @PostMapping(value = "/boot/prjct/saveOutordEntrpsPrmpc")
    public int saveOutordEntrpsPrmpc(@RequestBody List<Object> params) {
   
    	
    	return ProjectBaseDomain.saveOutordEntrpsPrmpc(params);
    }
    
    
    /**
     * 변경차수가 반려일 경우 초기화를 선택하였을 때
     */
    @PostMapping(value = "/boot/prjct/resetPrmpc")
    public int resetPrmpc(@RequestBody Map<String, Object> param) {
        return ProjectBaseDomain.resetPrmpc(param);
    }

    @PostMapping(value = "/boot/prjct/retrievePjrctCost")
    public List<Map<String, Object>> retrievePjrctCost(@RequestBody Map<String, Object> param) {
        return ProjectBaseDomain.retrievePjrctCost(param);
    }

    @PostMapping(value = "/boot/prjct/retrievePjrctEmpCost")
    public List<Map<String, Object>> retrievePjrctEmpCost(@RequestBody Map<String, Object> param) {
        return ProjectBaseDomain.retrievePjrctEmpCost(param);
    }

    @PostMapping(value = "/boot/prjct/retrievePjrctOutordEmpCost")
    public List<Map<String, Object>> retrievePjrctOutordEmpCost(@RequestBody Map<String, Object> param) {
        return ProjectBaseDomain.retrievePjrctOutordEmpCost(param);
    }
    
    /**
     * 프로젝트 결재선 DTL 승인여부 반영
     * @param paramList
     * @return
     */
    @PostMapping(value = "/boot/prjct/aprvPrjctAtrz")
    public String aprvPrjctAtrz(@RequestBody List<Map<String, Object>> paramList) {
    	return ProjectBaseDomain.aprvPrjctAtrz(paramList);
    }

    @PostMapping(value = "/boot/prjct/updateMmAtrzCmptnYn")
    public int updateMmAtrzCmptnYn(@RequestBody Map<String, Object> param){
        return ProjectBaseDomain.updateMmAtrzCmptnYn(param);
    }

    @PostMapping(value = "/boot/prjct/updateCtAtrzCmptnYn")
    public int updateCtAtrzCmptnYn(@RequestBody Map<String, Object> param){
        return ProjectBaseDomain.updateCtAtrzCmptnYn(param);
    }
    
    /**
     * 프로젝트 등록 및 수정된 후에 읽기/쓰기 권한을 부여한다.
     * @param param
     * @return
     */
    @PostMapping(value = "/boot/prjct/insertPrjctMngAuth")
    public int insertPrjctMngAuth(@RequestBody Map<String, Object> param) {
    	
    	return ProjectBaseDomain.insertPrjctMngAuth(param);
    	
    }
}
