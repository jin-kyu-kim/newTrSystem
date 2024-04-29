package com.trsystem.batchSkill.service;

import java.util.List;
import java.util.Map;

public interface BatchSkillService {
	public int prmotUpdateJBPS(Map<String, Object> param);
	public void executeEmpPrmot(String empId, String jbpsCd);
	public void executeEmpRetirePrcs();
	public void executeAddPrjctBgtPrmpc(String prjctId, int bgtMngOdr, int bgtMngOdrTobe);
	
	
	public int executeCostUpdate();
}