package com.trsystem.common.service;

import com.trsystem.common.mapper.CommonMapper;
import org.apache.commons.text.CaseUtils;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.*;
import java.util.*;

@Service
public class CommonServiceImpl implements CommonService {
    private final ApplicationYamlRead applicationYamlRead;

    private final CommonMapper commonMapper;
    private final SqlSession sqlSession;

    public CommonServiceImpl(ApplicationYamlRead applicationYamlRead, CommonMapper commonMapper, SqlSession sqlSession) {
        this.applicationYamlRead = applicationYamlRead;
        this.commonMapper = commonMapper;
        this.sqlSession = sqlSession;
    }

    @Override
    @Transactional
    public int insertData(List<Map<String, Object>> params) {

        int result = -1;
        //1. 테이블 컬럼명 가져오기
        String tbNm = params.get(0).get("tbNm").toString();
        try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            try {
                for (int i = 1; i < params.size(); i++) {
                    Map<String, Object> insertParam = params.get(i);
                    List<String> keys = new ArrayList<>(insertParam.keySet());
                    List<Object> inParams = new ArrayList<>(insertParam.values());

                    // INSERT문 생성
                    StringBuilder queryBuilder = new StringBuilder("INSERT INTO ").append(tbNm).append(" ( ");

                    for (int j = 0; j < inParams.size(); j++) {
                        if (j > 0) {
                            queryBuilder.append(", ");
                        }
                        queryBuilder.append(keys.get(j).replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase());
                    }
                    queryBuilder.append(") VALUES (");
                    for (int j = 0; j < inParams.size(); j++) {
                        if (j > 0) {
                            queryBuilder.append(", ");
                        }
                        queryBuilder.append("?");
                    }
                    queryBuilder.append(")");

                    // Stirng 쿼리 전환
                    PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString());
                    preparedStatement = querySetter(preparedStatement, inParams);
                    if (preparedStatement != null) {
                        result = preparedStatement.executeUpdate();
                    }
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

    @Override
    public int updateData(List<Map<String, Object>> params) {
        int result = -1;
        //1. 테이블 컬럼명 가져오기
        String tbNm = params.get(0).get("tbNm").toString();
        try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            try {
                    Map<String, Object> updateSet = params.get(1);
                    List<String> setKeys = new ArrayList<>(updateSet.keySet());
                    List<Object> setParams = new ArrayList<>(updateSet.values());
                    Map<String, Object> updateParam = params.get(2);
                    List<String> whereKeys = new ArrayList<>(updateSet.keySet());
                    List<Object> setWhere = new ArrayList<>(updateSet.values());

                    // UPDATE문 생성
                    StringBuilder queryBuilder = new StringBuilder("UPDATE ").append(tbNm).append(" SET ");

                    for (int j = 0; j < setParams.size(); j++) {
                        queryBuilder.append(setKeys.get(j).replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" = ").append(setParams.get(j));
                        if(j == setParams.size()-1){
                            queryBuilder.append(" , ");
                        }
                    }
                    for (int j = 0; j < updateParam.size(); j++) {
                        if(j == 0){
                            queryBuilder.append(" WHERE ");
                        }
                        queryBuilder.append(whereKeys.get(j).replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" = ").append(setWhere.get(j));
                        if(j == setParams.size()-1){
                            queryBuilder.append(" AND ");
                        }
                    }
                    // Stirng 쿼리 전환
                    PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString());
                    preparedStatement = querySetter(preparedStatement, setParams);
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

    @Override
    public int deleteData(List<Map<String, Object>> params) {
        int result = 1;

        //1. 테이블 컬럼명 가져오기
        String tbNm = params.get(0).get("tbNm").toString();

        try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            connection.setAutoCommit(false);
            try{
                Map<String, Object> insertParam = params.get(1);
                List<Object> inParams = new ArrayList<>(insertParam.values());
                List<String> keys = new ArrayList<>(insertParam.keySet());

                // DELETE문 생성
                StringBuilder queryBuilder = new StringBuilder("DELETE FROM ").append(tbNm).append(" WHERE ");

                for (int j = 0; j < inParams.size(); j++) {
                    queryBuilder.append(keys.get(j).replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" = ?");
                    if (j != inParams.size() - 1) {
                        queryBuilder.append(" AND ");
                    }
                }

                PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString());
                preparedStatement = querySetter(preparedStatement, inParams);
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

    public List<Map<String, Object>> commonSelect(List<Map<String, Object>> params) {
        List<Map<String, Object>> resultSet = new ArrayList<>();
        String tbNm = params.get(0).get("tbNm").toString();

        try (Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword())) {
            Map<String, Object> insertParam = params.get(1);
            List<Object> inParams = new ArrayList<>(insertParam.values());
            List<String> keys = new ArrayList<>(insertParam.keySet());

            // SELECT 문을 생성하기 위해 컬럼명을 얻어옴
            try (Statement statement = connection.createStatement()) {
                ResultSet resultParamSet = statement.executeQuery("SELECT * FROM " + tbNm + " WHERE 1=0"); // 빈 결과를 가져옴
                ResultSetMetaData metaData = resultParamSet.getMetaData();
                int columnCount = metaData.getColumnCount();

                //SELECT문 생성
//                StringJoiner queryBuilder = new StringJoiner(", ", "SELECT ", " FROM " + tbNm + " WHERE 1=1");
                StringBuilder queryBuilder = new StringBuilder("SELECT ");

                for (int i = 1; i <= columnCount; i++) {
                    if (metaData.getColumnName(i).endsWith("CD")) {
                        queryBuilder.append("(SELECT CD_NM FROM CD WHERE CD_VALUE = ").append(metaData.getColumnName(i)).append(") AS ").append(metaData.getColumnName(i)).append("_NM").append(" , ");
                    }
                    queryBuilder.append(metaData.getColumnName(i));
                    if(i != columnCount){
                        queryBuilder.append(" , ");
                    }
                }
                queryBuilder.append(" FROM ").append(tbNm).append(" WHERE 1 = 1");

                for (int j = 0; j < inParams.size(); j++) {
                    queryBuilder.append(" AND ");
                    queryBuilder.append(keys.get(j).replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" = ?");
                }

                try (PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString())) {
                    preparedStatementSetter(preparedStatement, inParams);
                    try (ResultSet result = preparedStatement.executeQuery()) {
                        metaData = result.getMetaData();
                        columnCount = metaData.getColumnCount();

                        while (result.next()) {
                            Map<String, Object> row = new HashMap<>();
                            for (int k = 1; k <= columnCount; k++) {
                                String columnName = metaData.getColumnName(k);
                                Object value = result.getObject(k);
                                row.put(CaseUtils.toCamelCase(columnName, false, '_'), value);
                            }
                            resultSet.add(row);
                        }
                    }
                }
            }
        } catch (SQLException e) {
            e.getStackTrace();
        }

        return resultSet;
    }

    private void preparedStatementSetter(PreparedStatement preparedStatement, List<Object> params) throws SQLException {
        for (int i = 0; i < params.size(); i++) {
            preparedStatement.setObject(i + 1, params.get(i));
        }
    }

    private PreparedStatement querySetter(PreparedStatement preparedStatement, List<Object> params){
        try {
            // for 루프에서 값을 바인딩
            for (int i = 0; i < params.size(); i++) {
                if(params.get(i) == ""){
                	System.out.println(params.get(i));
                    continue;
                }
                if (params.get(i) instanceof String) {
                    preparedStatement.setString(i + 1, (String) params.get(i));
                } else if (params.get(i) instanceof Integer) {
                    preparedStatement.setInt(i + 1, (Integer) params.get(i));
                } else if (params.get(i) instanceof Double) {
                    preparedStatement.setDouble(i + 1, (Double) params.get(i));
                } else if (params.get(i) == null) {
                	preparedStatement.setString(i + 1, null);
            	} else {
                    return null;
                }
            }
            return preparedStatement;
        } catch (SQLException e) {
            return null;
        }
    }

    public List<Map<String, Object>> queryIdSearch(Map<String, Object> param){
        String queryId = param.get("queryId").toString();
        return sqlSession.selectList("com.trsystem.mybatis.mapper."+queryId, param);
    }
}
