package com.trsystem.common.service;

import com.trsystem.common.mapper.CommonMapper;
import org.apache.commons.text.CaseUtils;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

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
            } catch (SQLException e) {
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
                List<String> whereKeys = new ArrayList<>(updateParam.keySet());
                List<Object> whereParams = new ArrayList<>(updateParam.values());

                // UPDATE문 생성
                StringBuilder queryBuilder = new StringBuilder("UPDATE ").append(tbNm).append(" SET ");

                for (int j = 0; j < setKeys.size(); j++) {
                    queryBuilder.append(setKeys.get(j).replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" = ?");
                    if (j != setKeys.size() - 1) {
                        queryBuilder.append(" , ");
                    }
                }
                for (int j = 0; j < updateParam.size(); j++) {
                    if (j == 0) {
                        queryBuilder.append(" WHERE ");
                    }
                    queryBuilder.append(whereKeys.get(j).replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" = ?");
                    if (j != whereKeys.size() - 1) {
                        queryBuilder.append(" AND ");
                    }
                }
                String queryString = queryBuilder.toString();

                // Stirng 쿼리 전환
                try (PreparedStatement preparedStatement = connection.prepareStatement(queryString)) {
                    // ?에 값 할당
                    int paramIndex = 1;

                    for (Object setValue : setParams) {
                        preparedStatement.setObject(paramIndex++, setValue);
                    }

                    for (Object whereValue : whereParams) {
                        preparedStatement.setObject(paramIndex++, whereValue);
                    }

                    result = preparedStatement.executeUpdate();
                    connection.commit();
                }
                connection.commit();
                connection.close();
                return result;
            } catch (SQLException e) {
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
            try {
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
            } catch (SQLException e) {
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

                // SELECT문 생성
                StringBuilder queryBuilder = new StringBuilder("SELECT ");

                for (int i = 1; i <= columnCount; i++) {
                    if (metaData.getColumnName(i).endsWith("CD")) {
                        queryBuilder.append("(SELECT CD_NM FROM CD WHERE CD_VALUE = ").append(metaData.getColumnName(i)).append(") AS ").append(metaData.getColumnName(i)).append("_NM").append(" , ");
                    }
                    queryBuilder.append(metaData.getColumnName(i));
                    if (i != columnCount) {
                        queryBuilder.append(" , ");
                    }
                }
                queryBuilder.append(" FROM ").append(tbNm).append(" WHERE 1 = 1");

                for (int j = 0; j < inParams.size(); j++) {
                    Object paramValue = inParams.get(j);
                    String paramName = keys.get(j);
                    queryBuilder.append(" AND ");

                    // 파라미터 값이 문자열이며 '%'를 포함하는 경우, LIKE 절을 사용
                    if (paramValue instanceof String && ((String) paramValue).contains("%")) {
                        queryBuilder.append(paramName.replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" LIKE ?");
                    } else if (paramValue instanceof String && ((String) paramValue).contains("&")) {
                        String[] dateRange = ((String) paramValue).split("&");
                        if (dateRange.length == 2) {
                            queryBuilder.append(paramName.replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase())
                                    .append(" BETWEEN ? AND ?");
                        } else {
                            throw new IllegalArgumentException("Invalid date range format");
                        }
                    } else {
                        queryBuilder.append(paramName.replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" = ?");
                    }
                }

                if (params.size() > 2 && params.get(2).containsKey("orderColumn") && params.get(2).containsKey("orderType")) {
                    String orderColumn = params.get(2).get("orderColumn").toString();
                    String orderType = params.get(2).get("orderType").toString();
                    if (!orderColumn.isEmpty() && ("ASC".equalsIgnoreCase(orderType) || "DESC".equalsIgnoreCase(orderType))) {
                        queryBuilder.append(" ORDER BY ").append(orderColumn.replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()).append(" ").append(orderType);
                    } else {
                        throw new IllegalArgumentException("Invalid orderColumn or orderType");
                    }
                }

                try (PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString())) {
                    querySetter(preparedStatement, inParams);
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
            e.printStackTrace(); // 예외 상세 정보를 출력하거나 기록하는 것이 좋습니다.
        }

        return resultSet;
    }

    private PreparedStatement querySetter(PreparedStatement preparedStatement, List<Object> params) {
        try {
            // for 루프에서 값을 바인딩
            for (int i = 0; i < params.size(); i++) {
                if (params.get(i) == "") {
                    System.out.println(params.get(i));
                    continue;
                }

                if (params.get(i) instanceof String && ((String) params.get(i)).contains("&") && !((String) params.get(i)).contains("<p>")) {
                    String[] dateRange = ((String) params.get(i)).split("&");
                    if (dateRange.length == 2) {
                        preparedStatement.setObject(i + 1, dateRange[0]);
                        preparedStatement.setObject(i + 2, dateRange[1]);
                        i++;
                        continue;
                    } else {
                        throw new IllegalArgumentException("Invalid date range format");
                    }
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

    public List<Map<String, Object>> queryIdSearch(Map<String, Object> param) {
        String queryId = param.get("queryId").toString();
        return sqlSession.selectList("com.trsystem.mybatis.mapper." + queryId, param);
    }

    public int insertlongText(List<Map<String, Object>> params, MultipartFile file){
        int result = 0;

        if(params.size()>1){
            String atchmnflId = this.insertFile(params, file);
            if(atchmnflId.isEmpty()){
                params.get(1).put(atchmnflId, atchmnflId);
                params.get(1).remove("attachments");
                insertData(params);
            }
        }else{
            throw new IllegalArgumentException("parameter size error");
        }
        return result;
    }

    private String insertFile(List<Map<String, Object>> params, MultipartFile file) {
        String atchmnflId = null;

        if(params.get(1).containsKey("attachments")) {
            @SuppressWarnings("unchecked")
            List<Map<String, MultipartFile>> attachmentsData = (List<Map<String, MultipartFile>>) params.get(1).get("attachments");

            List<MultipartFile> files = attachmentsData.stream()
                    .map(map -> map.get("file"))
                    .collect(Collectors.toList());
            try {
                if(files.isEmpty()){
                    return null;
                }
                String uploadDir = "./src/main/resources/upload";
                File directory = new File(uploadDir);

                if (!directory.exists() && !directory.mkdirs()) {
                    throw new SecurityException("unable to create directory");
                }

                atchmnflId = "";
                int atchmnflSn = 1;
                if (params.get(1).containsKey("atchmnflId") && !params.get(1).get("atchmnflId").equals("")) {
                    atchmnflId = (String) params.get(1).get("atchmnflId");
                    atchmnflSn = 1;// 최대값 구하기
                } else {
                    atchmnflId = String.valueOf(UUID.randomUUID());
                }
                List<Map<String, Object>> insertParam = new ArrayList<>();

                Map<String, Object> tbNm = new HashMap<>();
                tbNm.put("tbNm", "");

                insertParam.add(tbNm);

                Map<String, Object> insertP = new HashMap<>();
                insertP.put("atchmnflId", atchmnflId);

                for (Object folder : files) {
                    MultipartFile inFile = (MultipartFile) folder;

                    Path filePath = Path.of(uploadDir + inFile.getOriginalFilename());
                    Files.copy(inFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    atchmnflSn++;

                    insertP.put("atchmnflSn", atchmnflSn);
                    insertP.put("strgFileNm", inFile.getName());
                    insertP.put("realFileNm", inFile.getOriginalFilename());
                    insertP.put("fileStrgCours", filePath);
                    insertP.put("regDt", System.currentTimeMillis());
                    insertP.put("mdfcnDt", System.currentTimeMillis());
                    if (params.get(1).get("regEmpId") != null) {
                        insertP.put("regEmpId", (String) params.get(1).get("regEmpId"));
                        insertP.put("mdfcnEmpId", (String) params.get(1).get("regEmpId"));
                    }

                    insertParam.add(insertP);

                    this.insertData(insertParam);
                }
                return atchmnflId;
            } catch (IOException e) {
                // 파일 업로드 실패시 예외 처리
                e.getStackTrace();
                return atchmnflId;
            }
        }else{
            return null;
        }
    }
}
