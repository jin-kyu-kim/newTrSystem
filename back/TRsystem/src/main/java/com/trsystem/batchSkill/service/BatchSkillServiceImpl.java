package com.trsystem.batchSkill.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.CallableStatement;
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
                
                executeEmpPrmotPrjctPrmpcMng(empId.get("id").toString(),empId.get("jbps").toString()); //프로젝트예산원가 차수 변경
                
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
	public void executeEmpPrmotPrjctPrmpcMng(String empId, String jbpsCd){
		
		try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            
            String callProcedure = "CALL nwTr.P_PRMOT_PRMPC_CHG(?, ?)";
            
            try (CallableStatement callableStatement = connection.prepareCall(callProcedure)){
            	
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
	
}
