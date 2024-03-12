package com.trsystem.batchSkill.service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;

import com.trsystem.common.mapper.CommonMapper;
import com.trsystem.common.service.ApplicationYamlRead;

@Service
public class BatchSkillServiceImpl implements BatchSkillService { 
	private final ApplicationYamlRead applicationYamlRead;
	
	private final SqlSession sqlSession;
	
	public BatchSkillServiceImpl(ApplicationYamlRead applicationYamlRead, CommonMapper commonMapper, SqlSession sqlSession) {
        this.applicationYamlRead = applicationYamlRead;
//        this.commonMapper = commonMapper;
        this.sqlSession = sqlSession;
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
	public void executeModPrjctBgtPrmpc(String prjctId, int bgtMngOdr, int bgtMngOdrTobe) {
		
		try {
			
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            
            String callProcedure = "CALL nwTr.P_MOD_PRJCT_BGT_PRMPC(?, ?, ?)";
            
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
}
