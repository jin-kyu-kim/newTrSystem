package com.trsystem.batchSkill.service;

import com.trsystem.common.service.ApplicationYamlRead;
import com.trsystem.common.service.CommonService;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BatchSkillServiceImpl implements BatchSkillService { 
	private final ApplicationYamlRead applicationYamlRead;
    private static CommonService commonService;
	private final SqlSession sqlSession;
	
	public BatchSkillServiceImpl(ApplicationYamlRead applicationYamlRead, CommonService commonService, SqlSession sqlSession) {
        this.applicationYamlRead = applicationYamlRead;
        BatchSkillServiceImpl.commonService = commonService;
        this.sqlSession = sqlSession;
    }

    @Transactional
    public void prmotUpdateJBP(List<Map<String, Object>> empId){
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> map = new HashMap<>();
        Map<String, Object> snSearch = new HashMap<>();
        String bizSttsCd;
        int bgtOdrSn;
        // empId - 승진한 직원 목록, 변경된 직원의 직급, 일자
        // 직원 승진 프로세스
        for(Map<String, Object> emp : empId){
        // 1. 직원의 길이만큼 반복하면서 직원을 승진시켜주고 승진한 내역을 직원 이력에 추가한다.
            sqlSession.insert("com.trsystem.mybatis.mapper.batchSkill.emp1", emp); // 현재
            //또는 공통사용 예시
//            map.put("tbNm", "EMP");
//            list.add(map);
//            list.add(emp);
            commonService.insertData(list);
            sqlSession.insert("com.trsystem.mybatis.mapper.batchSkill.emp2", emp); // 이력
//            공통사용예시
//            map.clear();
//            list.clear();
//            map.put("tbNm", "EMP_HIST");
//            map.put("snColumn", "EMP_HIST_SN");
//            snSearch.put("emp", emp.get("empId").toString());
//            map.put("snSearch", snSearch);
//            list.add(map);
//            list.add(emp);

            // 2. 승진 대상인 직원의  현시점이후에 투입 예정이 되어있는 프로젝트의 목록을 불러온다.
            List<String> prjctIdList =sqlSession.selectList("com.trsystem.mybatis.mapper.batchSkill.emp3", emp);
            // 3. 프로젝트의 최종값이 진행중인지 - 변경중 혹은 임시저장인지 확인한다.
            for(String prjctId : prjctIdList){
                //현재 프로젝트 최대값의 상태와 최대값의
                Map<String, Object> prjctInfo = sqlSession.selectOne("com.trsystem.mybatis.mapper.batchSkill.emp4", prjctId);
                bizSttsCd = prjctInfo.get("bizSttsCd").toString();
                bgtOdrSn = (Integer) prjctInfo.get("bgtOdrSn");
                //   4-1. 현재 프로젝트를 복제하여 저장값을 임시저장으로 새로운 차수를 생성하고 해당하는 =>진급한 직위의 값으로 변경 (진행중 -> 임시저장)
                if(bizSttsCd.isEmpty() || bizSttsCd.equals("VTW00404")){
                    continue;
                }

                if(bizSttsCd.equals("VTW00402")){
                    bgtOdrSn++;
                    //프로시저를 콜해서 현재상태 그대로 임시저장상태인 원가를 생성한다. (스냅샷 생성)
                }
                //   4-2. 프로젝트별로 승진한 직원의 현재달 이후의 투입정보 모두 업데이트 => 진급한 직위의 값으로 변경 (임시저장, 변경중 -> 임시저장)
                emp.put("prjctId", prjctId);
                emp.put("bgtOdrSn", bgtOdrSn);
                sqlSession.update("com.trsystem.mybatis.mapper.batchSkill.emp5", emp);
            }
        }
    }
	
	//0.직원 테이블의 직위가 업데이트 되면 (화면 개발 전 기능구현 테스트용 메서드)
	@Override
	public int prmotUpdateJBPS(Map<String, Object> empId){
		int result = -1;
		
		try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            try {
            	StringBuilder queryBuilder = new StringBuilder("UPDATE EMP SET mdfcn_dt = now(), JBPS_CD = '")
            			.append(empId.get("jbps")).append("' ")
            			.append(" WHERE EMP_ID =  '").append(empId.get("id")).append("' ");
            	
            	PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString());
                if (preparedStatement != null) {
                    result = preparedStatement.executeUpdate();
                }
            	
            	connection.commit();
                connection.close();
                
                executeEmpPrmot(empId.get("id").toString(),empId.get("jbps").toString()); //프로젝트예산원가 차수 변경
                
            	return result;
            }catch (SQLException e){
                connection.rollback();
                e.getStackTrace();
                return result;
            }
        } catch (SQLException e) {
            e.getStackTrace();
            return result;
        }
	}
	
	
	// 승진직원 프로젝트 원가 및 예산관리차수 변경 프로시저 호출
	public void executeEmpPrmot(String empId, String jbpsCd){
		
		try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            
            String callProcedure = "CALL nwTr.P_GET_PRJCT_ID(?, ?)";
            
            try (CallableStatement callableStatement = connection.prepareCall(callProcedure)){
            	
            	// 넘겨주는 파라미터 형식 v_empId : 'ID1, ID2, ID3, ...' / v_jbpsCd : 'CD1, CD2, CD3, ...'
            	callableStatement.setString("v_empId", empId);
            	callableStatement.setString("v_jbpsCd", jbpsCd);
            	callableStatement.executeQuery();
            	
            	connection.commit();
                connection.close();
            	
            }catch (SQLException e){
                e.getStackTrace();
                connection.rollback();
            }
        } catch (SQLException e) {
            e.getStackTrace();
        }
	}
	
	// 퇴사한 직원 퇴사일자의 다다음달부터 TRS 로그인과 문체비 지급을 막는 프로시저 호출
	@Override
	public void executeEmpRetirePrcs() {
		
		try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            
            String callProcedure = "CALL nwTr.P_EMP_RETIRE_PRCS()";
            
            try (CallableStatement callableStatement = connection.prepareCall(callProcedure)){
            	
            	callableStatement.executeUpdate();
            	
            	connection.commit();
                connection.close();
                
            }catch (SQLException e){
                e.getStackTrace();
                connection.rollback();
            }
        } catch (SQLException e) {
            e.getStackTrace();
        }
		
	}
	
	/**
	 * 새로운 변경원가 생성 시 기존 값들을 복사해준다. 
	 */
	@Override
	public void executeAddPrjctBgtPrmpc(String prjctId, int bgtMngOdr, int bgtMngOdrTobe) {
		
		try {
			
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            
            String callProcedure = "CALL nwTr.P_ADD_PRJCT_BGT_PRMPC(?, ?, ?)";
            
            try (CallableStatement callableStatement = connection.prepareCall(callProcedure)) {
            	
            	callableStatement.setString("v_prjctId", prjctId);
            	callableStatement.setInt("v_bgtMngOdr", bgtMngOdr);
            	callableStatement.setInt("v_bgtMngOdrTobe", bgtMngOdrTobe);
            	callableStatement.executeQuery();
            	
            	connection.commit();
                connection.close();
            	
            } catch (SQLException e) {
                connection.rollback();
            }
            
		} catch (SQLException e) {
			return ;
		}
	}
	
	
	@Transactional
	public int executeCostUpdate() {
		try {
			String queryIdMM = "batchMapper.executeCostUpdateMM";
			int resultMM = sqlSession.insert("com.trsystem.mybatis.mapper." + queryIdMM);
			
			String queryIdCT = "batchMapper.executeCostUpdateCT";
			int resultCT = sqlSession.insert("com.trsystem.mybatis.mapper." + queryIdCT);
		
			return resultMM + resultCT;
		} catch (Exception e) {
			throw e;		
		}
	}
	
	
}
