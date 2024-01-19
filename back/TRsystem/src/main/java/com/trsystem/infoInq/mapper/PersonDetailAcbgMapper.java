package com.trsystem.infoInq.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface PersonDetailAcbgMapper {
    public List<Map<String, Object>> getDetailAcbg();
    public List<Map<String, Object>> getFggAblty(String indvdlId);
    public int insertAcbg(Map<String, String> insertParam);
    public int updateAcbg(Map<String, String> updateParam);
    public int deleteAcbg(Map<String, String> deleteParam);
}
