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
                
                prmotPrjctSelect(empId.get("id").toString(),empId.get("jbps").toString()); //승진한 직원이 속한 프로젝트 목록 조회
                
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
	
	//1. 프로젝트 테이블의 사업종료일자가 지나지 않은 프로젝트 중 자사인건비원가 테이블에서 승진한 직원이 포함된 프로젝트 목록 조회
	public List<Map<String, Object>> prmotPrjctSelect(String empId, String jbpsCd){
		List<Map<String, Object>> resultSet = new ArrayList<>();
		
		try (Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword())) {
            try (Statement statement = connection.createStatement()) {
                
            	StringBuilder queryBuilder = new StringBuilder("SELECT a.PRJCT_ID FROM nwTr.MMNY_LBRCO_PRMPC a JOIN nwTr.PRJCT b ")
            			.append("ON b.BIZ_END_YMD >= (SELECT DATE_FORMAT(MDFCN_DT, '%Y%m%d') FROM nwTr.EMP WHERE EMP_ID = '")
            			.append(empId).append("') ")
            			.append("AND a.PRJCT_ID = b.PRJCT_ID WHERE EMP_ID = '")
            			.append(empId).append("' ");
            	
            	try (PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString())) {
                    try (ResultSet result = preparedStatement.executeQuery()) {

                        while (result.next()) {
                            Map<String, Object> row = new HashMap<>();
                            row.put("prjctId", result.getString("PRJCT_ID"));
                            resultSet.add(row);
                            
                            //프로젝트예산원가 및 하위 테이블데이터 insert
                            pbpPrmotInsertData(empId, row.get("prjctId").toString());
                            //자사인건비 테이블 데이터 insert
                            mimPrmotInsertData(empId, jbpsCd, row.get("prjctId").toString());
                        }
                    }
                }
            }
        }catch (SQLException e){
        	e.getStackTrace();
        }
		
		return resultSet;
	}
	
	//2. 해당 프로젝트의 프로젝트예산원가 예산관리차수 +1 해서 insert
	@Transactional
    public int pbpPrmotInsertData(String empId, String prjctId) {
		
		int result = -1;
		
		try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            
            try {
            	
            	StringBuilder queryBuilder = new StringBuilder("INSERT INTO nwTr.PRJCT_BGT_PRMPC ")
            			.append("SELECT PRJCT_ID , BGT_MNG_ODR+1, NULL, TOT_ALTMNT_BGT , NOW(), NULL, NULL, NULL, 'VTW03302' ") //결재요청
            			.append("FROM nwTr.PRJCT_BGT_PRMPC WHERE PRJCT_ID = '")
            			.append(prjctId).append("' ")
		            	.append("AND BGT_MNG_ODR = (SELECT MAX(BGT_MNG_ODR) FROM nwTr.PRJCT_BGT_PRMPC WHERE PRJCT_ID = '")
		            	.append(prjctId).append("') ");
            	
            	PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString());

            	if (preparedStatement != null) {
                    result = preparedStatement.executeUpdate();
                }
            	
            	
            	connection.commit();
            	
            	prmotInsertData(empId, prjctId); // 프로젝트예산원가 하위 테이블들 데이터 insert
            	
                connection.close();
                
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
	
	//2-1. 해당 프로젝트의 최대 예산관리차수 구하기
	public int prmotMaxOdr(String prjctId){
		
		int maxOdr = 1;
		
		try (Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword())) {
            try (Statement statement = connection.createStatement()) {
            	StringBuilder queryBuilder = new StringBuilder("SELECT MAX(BGT_MNG_ODR) maxOdr FROM nwTr.PRJCT_BGT_PRMPC WHERE PRJCT_ID = '")
            			.append(prjctId).append("' "); //최대차수 구함
            	
            	try (PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString())) {
                    try (ResultSet result = preparedStatement.executeQuery()) {
                    	while (result.next()) {
                    		maxOdr = result.getInt("maxOdr");
                        }
                    }
                }
            }
        }catch (SQLException e){
        	e.getStackTrace();
        }
		
		return maxOdr;
	}
	
	//2-2. 해당 프로젝트의 관련 테이블들 예산관리차수 +1 해서 insert
	@Transactional
    public int prmotInsertData(String empId, String prjctId) {
		
		//프로젝트예산원가 하위테이블
		ArrayList<String> tbList = new ArrayList();
		tbList.add("MMNY_LBRCO_PRMPC"); //자사인건비원가
		tbList.add("EXPENS_PRMPC"); //경비원가
		tbList.add("EXPENS_MNBY_PRMPC_DTLS"); //경비월별원가내역
		tbList.add("MATRL_CT_PRMPC"); //재료비용원가
		tbList.add("OUTORD_ENTRPS_CT_PRMPC"); //외주업체비용원가
		tbList.add("OUTORD_ENTRPS_CT_PRMPC_DTL"); //외주업체비용원가상세
		tbList.add("OUTORD_LBRCO_PRMPC"); //외주인건비원가
		tbList.add("OUTORD_LBRCO_PRMPC_DTL"); //외주인건비원가상세
		
		List<Map<String, Object>> columnList = new ArrayList<>();
		int result = -1;
		int columnCount = 0;
		
		try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            
            try {
            	
            	for(int i = 0; i < tbList.size(); i++) {
            		StringBuilder queryBuilder = new StringBuilder();
            		
            		queryBuilder.append("INSERT INTO nwTr.").append(tbList.get(i)).append(" SELECT ");
            		columnList = columnSet(tbList.get(i),prjctId);
            		columnCount = columnList.size();

        			for(int j = 0; j < columnCount; j++) {
        				
        				queryBuilder.append(columnList.get(j).get("columnNm"));
        				
        				if(j != columnCount - 1)
        					queryBuilder.append(", ");
        			}
            			
        			queryBuilder.append(" FROM nwTr.").append(tbList.get(i))
        			.append(" WHERE PRJCT_ID = '")
        			.append(prjctId).append("' ");
        			
        			if(tbList.get(i).equals("MMNY_LBRCO_PRMPC"))
        				queryBuilder.append(" AND EMP_ID = '").append(empId).append("' ");
            	
	            	PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString());
	                if (preparedStatement != null) {
	                    result = preparedStatement.executeUpdate();
	                    queryBuilder = null;
	                    preparedStatement = null;
	                }
	            	
	            	connection.commit();
            	}
                connection.close();
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
	
	//2-3. 테이블 컬럼목록 조회
	public List<Map<String, Object>> columnSet(String tbNm, String prjctId) {
        List<Map<String, Object>> resultSet = new ArrayList<>();
     
        try (Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword())) {
            try (Statement statement = connection.createStatement()) {
            		
        		StringBuilder queryBuilder = new StringBuilder("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS ")
            			.append("WHERE 1=1 AND TABLE_NAME='")
            			.append(tbNm).append("' ")
            			.append("ORDER BY ORDINAL_POSITION");
            	
            	try (PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString())) {
                    try (ResultSet result = preparedStatement.executeQuery()) {

                        while (result.next()) {
                            Map<String, Object> row = new LinkedHashMap<>();
                            
                            if(result.getString("COLUMN_NAME").equals("BGT_MNG_ODR")) 
                            	row.put("columnNm", Integer.toString(prmotMaxOdr(prjctId))); //예산관리차수값 입력
                            else
                            	row.put("columnNm", result.getString("COLUMN_NAME"));
                            resultSet.add(row);
                        }
                    }
                }
            }
        }catch (SQLException e){
        	e.getStackTrace();
        }
    		
        return resultSet;
	}
	
	//2-4. 자사투입MM insert
	public int mimPrmotInsertData(String empId, String jbpsCd, String prjctId){
		
		int result = -1;
		int maxOdr = prmotMaxOdr(prjctId);
		
		try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            
            try {
            	
            	StringBuilder queryBuilder = new StringBuilder("INSERT INTO nwTr.MMNY_INPT_MM SELECT EMP_ID , PRJCT_ID, INPT_YM, EXPECT_MM, ")
            			.append(maxOdr).append(", '")
            			.append(jbpsCd).append("' ")
            			.append("FROM nwTr.MMNY_INPT_MM WHERE EMP_ID = '")
		            	.append(empId).append("' AND PRJCT_ID = '")
		            	.append(prjctId).append("' ");
            	
            	PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString());

            	if (preparedStatement != null) {
                    result = preparedStatement.executeUpdate();
                }
            	
            	connection.commit();
                connection.close();
                
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
		
}
