package com.trsystem.common.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CommonService {
    public int insertData(List<Map<String, Object>> params);
    public int updateData(List<Map<String, Object>> params);
    public int deleteData(List<Map<String, Object>> params);
    public List<Map<String, Object>> commonSelect(List<Map<String, Object>> params);
    public int commonGetMax(List<Map<String, Object>> params);
    public List<Map<String, Object>> queryIdSearch(Map<String, Object> param);
    public int queryIdDataControl(Map<String, Object> param);
    public int insertFile(Map<String, Object> tbNm, Map<String, Object> params,List<MultipartFile> attachments,  Map<String, Object> idData, List<Map<String, Object>> deleteFiles);
    public int deleteFile(Map<String, Object> params);
}
