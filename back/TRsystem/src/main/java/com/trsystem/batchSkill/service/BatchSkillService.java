package com.trsystem.batchSkill.service;

import java.util.List;
import java.util.Map;

public interface BatchSkillService {
	public int prmotUpdateJBPS(Map<String, Object> param);
	public List<Map<String, Object>> prmotPrjctSelect(String empId, String jbpsCd);
	public int pbpPrmotInsertData(String empId, String prjctId);
	public int prmotMaxOdr(String prjctId);
	public int prmotInsertData(String empId, String prjctId);
	public List<Map<String, Object>> columnSet(String tbNm, String prjctId);
	public int mimPrmotInsertData(String empId, String jbpsCd, String prjctId); 

}
