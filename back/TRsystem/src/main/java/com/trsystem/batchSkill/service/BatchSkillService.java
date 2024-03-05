package com.trsystem.batchSkill.service;

import java.util.List;
import java.util.Map;

public interface BatchSkillService {
	public int prmotUpdateJBPS(Map<String, Object> param);
	public void executeEmpPrmotPrjctPrmpcMng(String empId, String jbpsCd);

}
