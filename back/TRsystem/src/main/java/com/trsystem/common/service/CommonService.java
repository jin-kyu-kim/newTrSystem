package com.trsystem.common.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CommonService {
    public int insertData(List<Map<String, Object>> params);
    public int updateData(List<Map<String, Object>> params);
    public int deleteData(List<Map<String, Object>> params);
    public List<Map<String, Object>> commonSelect(List<Map<String, Object>> params);
    public List<Map<String, Object>> queryIdSearch(Map<String, Object> param);
    public int insertlongText(List<Map<String, Object>> param, MultipartFile file);
}
