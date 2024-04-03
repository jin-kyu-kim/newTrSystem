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
import java.time.Instant;
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
        int snMax;
        if(params.get(0).containsKey("snColumn")){
            List<Map<String, Object>>maxParam = new ArrayList<>();
            Map<String, Object> tableMap = new HashMap<>();
            tableMap.put("tbNm", tbNm);
            tableMap.put("snColumn", params.get(0).get("snColumn"));

            maxParam.add(tableMap);
            if(params.get(0).containsKey("snSearch")){
                maxParam.add((Map<String, Object>) params.get(0).get("snSearch"));
            }

            snMax = commonGetMax(maxParam);
            params.get(1).put(params.get(0).get("snColumn").toString(), snMax);
            for(int i=1; i < params.size(); i++){
                params.get(i).put(params.get(0).get("snColumn").toString(), ++snMax);
            }
        }
        try {
            Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword());
            // 트랜잭션 시작
            connection.setAutoCommit(false);
            try (Statement statement = connection.createStatement()){
                ResultSet resultParamSet = statement.executeQuery("SELECT * FROM "  + tbNm + " WHERE 1=0"); // 빈 결과를 가져옴
                ResultSetMetaData metaData = resultParamSet.getMetaData();
                int columnCount = metaData.getColumnCount();

                Map<String, Object> insertParam;
                Map<String, Object> validInsertParam;
                for (int i = 1; i < params.size(); i++) {
                    insertParam = params.get(i);
                    validInsertParam = new HashMap<>();

                    for (String key : insertParam.keySet()) {
                        String upVal = key.replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase();
                        for (int j = 1; j <= columnCount; j++) {
                            String columnLabel = metaData.getColumnLabel(j);
                            if (upVal.equalsIgnoreCase(columnLabel)) {
                                validInsertParam.put(key, insertParam.get(key));
                                break;
                            }
                        }
                    }

                    List<String> keys = new ArrayList<>(validInsertParam.keySet());
                    List<Object> inParams = new ArrayList<>(validInsertParam.values());

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
            Map<String, Object> insertParam = new HashMap<>();
            if(params.size()>1){
                insertParam = params.get(1);
            }
            List<Object> inParams = new ArrayList<>(insertParam.values());
            List<String> keys = new ArrayList<>(insertParam.keySet());

            // SELECT 문을 생성하기 위해 컬럼명을 얻어옴
            try (Statement statement = connection.createStatement()) {
                ResultSet resultParamSet = statement.executeQuery("SELECT * FROM "  + tbNm + " WHERE 1=0"); // 빈 결과를 가져옴
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

                for (int j = 0; j < inParams.size(); j++ ) {
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

    public int commonGetMax(List<Map<String, Object>> params) {
        List<Map<String, Object>> resultSet = new ArrayList<>();
        String tbNm = params.get(0).get("tbNm").toString();
        String snColumn = params.get(0).get("snColumn").toString().replaceAll("([a-z])([A-Z]+)", "$1_$2").toUpperCase();
        int value = -1;

        try (Connection connection = DriverManager.getConnection(applicationYamlRead.getUrl(), applicationYamlRead.getUsername(), applicationYamlRead.getPassword())) {


            // SELECT 문을 생성하기 위해 컬럼명을 얻어옴
            try (Statement statement = connection.createStatement()) {
                // SELECT문 생성
                StringBuilder queryBuilder = new StringBuilder("SELECT IFNULL(MAX(").append(snColumn).append("), 0)AS MAX FROM ").append(tbNm).append(" WHERE 1 = 1");
                List<Object> inParams = new ArrayList<>();

                if(params.size()>1){
                    Map<String, Object> insertParam = params.get(1);
                    inParams = new ArrayList<>(insertParam.values());
                    List<String> keys = new ArrayList<>(insertParam.keySet());
                    for (int j = 0; j < inParams.size(); j++ ) {
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
                }

                try (PreparedStatement preparedStatement = connection.prepareStatement(queryBuilder.toString())) {
                    querySetter(preparedStatement, inParams);
                    try (ResultSet result = preparedStatement.executeQuery()) {
                        if (result.next()) {
                            value = result.getInt("MAX");
                        }
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace(); // 예외 상세 정보를 출력하거나 기록하는 것이 좋습니다.
        }

        return value;
    }

    private PreparedStatement querySetter(PreparedStatement preparedStatement, List<Object> params) {
        try {
            // for 루프에서 값을 바인딩
            int j = 0;
            for (int i = 0; i < params.size(); i++) {
                if (params.get(i) == "") {
                    System.out.println(params.get(i));
                    continue;
                }

                if (params.get(i) instanceof String && ((String) params.get(i)).contains("&") && !((String) params.get(i)).contains("<p>")) {
                    String[] dateRange = ((String) params.get(i)).split("&");
                    if (dateRange.length == 2) {
                        preparedStatement.setObject(j+1, dateRange[0]);
                        preparedStatement.setObject(j+2, dateRange[1]);
                        j += 2;
                        continue;
                    } else {
                        throw new IllegalArgumentException("Invalid date range format");
                    }
                }

                if (params.get(i) instanceof String) {
                    preparedStatement.setString(j+1, (String) params.get(i));
                } else if (params.get(i) instanceof Integer) {
                    preparedStatement.setInt(j+1, (Integer) params.get(i));
                }  else if (params.get(i) instanceof Long) { // bigint (Long) 처리
                    preparedStatement.setLong(j+1, (Long) params.get(i));
                }else if (params.get(i) instanceof Double) {
                    preparedStatement.setDouble(j+1, (Double) params.get(i));
                } else if (params.get(i) instanceof Timestamp) {
                    preparedStatement.setTimestamp(j+1, (Timestamp) params.get(i));
                }  else if (params.get(i) instanceof Instant) {
                    preparedStatement.setTimestamp(j+1, Timestamp.from((Instant) params.get(i)));
                }  else if (params.get(i) == null) {
                    preparedStatement.setString(j+1, null);
                }  else {
                    j++;
                    return null;
                }
                j++;
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

    public int queryIdDataControl(Map<String, Object> param) {
        String queryId = param.get("queryId").toString();
        String status = param.get("state").toString();

        switch (status){
            case "INSERT" :
                return sqlSession.insert("com.trsystem.mybatis.mapper." + queryId, param);
            case "UPDATE" :
                return sqlSession.update("com.trsystem.mybatis.mapper." + queryId, param);
            case "DELETE" :
                return sqlSession.delete("com.trsystem.mybatis.mapper." + queryId, param);
        }
        return -1;
    }

    @Transactional
    public int insertFile(Map<String, Object> tbData, Map<String, Object> params, List<MultipartFile> attachments,
                          Map<String, Object> idData, List<Map<String, Object>> deleteFiles) {
        int atchResult = 0;//첨부파일 insert결과
        int result = 0;

        Map<String, Object> atchmnflMap = new HashMap<>();
        Map<String, Object> tableMap = new HashMap<>();
        List<Map<String, Object>> atchmnflParam = new ArrayList<>();
        List<Map<String, Object>> insertParam = new ArrayList<>();

        String atchmnflId = null;
        int atchmnflSn = 1;

        //2. 파일 내부 디렉토리에 업로드
//        String uploadDir = "../../front/public/upload";
        String uploadDir = "TRsystem/upload";
        // 2-1 파일일 디렉토리가 없으면 생성
        Path directory = Path.of(uploadDir);

        // 수정 - 첨부파일 개별 삭제
        if(idData != null){
            List<Map<String, Object>> deleteParam = new ArrayList<>();
            Map<String, Object> directoryFile = new HashMap<>();

            tableMap.put("tbNm", "ATCHMNFL");
            tableMap.put("snColumn", "atchmnflSn");
            deleteParam.add(tableMap);
            atchmnflSn = commonGetMax(deleteParam) + 1;
            tableMap.clear();

            if(deleteFiles.size() > 1){
                for (int i=1; i<deleteFiles.size(); i++) {
                    deleteParam.clear();
                    directoryFile.clear();

                    deleteParam.add(deleteFiles.get(0));
                    directoryFile.put("atchmnflSn", deleteFiles.get(i).get("atchmnflSn"));
                    deleteParam.add(directoryFile);
                    deleteData(deleteParam);

                    File file = new File(directory + "/" + deleteFiles.get(i).get("strgFileNm"));
                    if (file.exists()) {
                        file.delete();
                    }
                }
            }
        }

        try{
            if (Files.notExists(directory)) {
                Files.createDirectories(directory);
            }

            if (attachments != null) {
                //1. 기존에 채번된 첨부파일 ID가 있는지 확인
                if(!params.containsKey("atchmnflId") || params.get("atchmnflId") == null || params.get("atchmnflId").equals("")){
                    // 1-1 없다면 첨부파일 ID 생성 순번은 1부터 시작
                    atchmnflId = UUID.randomUUID().toString();
                }else{
                    // 1-2 있다면 첨부파일 ID 사용 생성 순번은 1부터 시작
                    atchmnflId = params.get("atchmnflId").toString();
                }

                for(MultipartFile file : attachments){
                    // UUID를 사용하여 서버에 저장될 파일명 생성
                    String storedFileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
                    // 파일 저장
                    Path filePath = directory.resolve(storedFileName);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    Instant currentTimestamp = Instant.now();
                    //3. 저장경로 및 명칭 지정하여 첨부파일 테이블에 INSERT
                    atchmnflMap.put("atchmnflId", atchmnflId);
                    atchmnflMap.put("atchmnflSn", atchmnflSn++);
                    atchmnflMap.put("strgFileNm", storedFileName); // 저장된파일명칭
                    atchmnflMap.put("realFileNm", file.getOriginalFilename());
                    atchmnflMap.put("fileStrgCours", uploadDir); // 파일저장경로
                    atchmnflMap.put("regDt", currentTimestamp);
//                    atchmnflMap.put("regEmpId", params.get("regEmpId").toString());
                    atchmnflMap.put("mdfcnDt", currentTimestamp);
//                    atchmnflMap.put("mdfcnEmpId", params.get("regEmpId").toString());

                    atchmnflParam.clear();
                    tableMap.put("tbNm", "ATCHMNFL");
                    atchmnflParam.add(tableMap);
                    atchmnflParam.add(atchmnflMap);

                    atchResult += insertData(atchmnflParam);
                }
            }

            if(idData == null){
                //4. 입력된 첨부파일 ID를 parameter에 지정
                params.put("atchmnflId", atchmnflId);

                //5. 사용하려는 테이블에 INSERT
                insertParam.add(tbData);
                insertParam.add(params);
                result = insertData(insertParam);
            } else {
                //5. 사용하려는 테이블에 UPDATE
                insertParam.add(tbData);
                insertParam.add(params);
                insertParam.add(idData);
                result = updateData(insertParam);
            }

            return result;
        }catch (IOException e){
            return result;
        }
    }

    @Transactional
    public int deleteFile(Map<String, Object> deleteData) {
        List<Map<String, Object>> params = (List<Map<String, Object>>) deleteData.get("params");
        List<Map<String, Object>> fileParams = (List<Map<String, Object>>) deleteData.get("fileParams");

        int result = 0;
        String uploadDir = "TRsystem/upload";
        Path directory = Path.of(uploadDir);

        result += deleteData(params);

        List<Map<String, Object>> fileNameList = commonSelect(fileParams);
        for (Map<String, Object> strgName : fileNameList) {
            File file = new File(directory + "/" + strgName.get("strgFileNm"));
            if (file.exists()) {
                file.delete();
            }
        }
        result += deleteData(fileParams);
        return result;
    }
}
