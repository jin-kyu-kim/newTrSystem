package com.trsystem.infoInq.service;

import java.util.List;
import java.util.Map;

public interface PersonDetailAcbgService {
    public List<Map<String, Object>> getDetailAcbg();
    public List<Map<String, Object>> getFggAblty(String indvdlId);
    boolean deleteAcbg(Map<String, String> deleteParam);
    boolean insertAcbg(Map<String, String> insertParam);
    boolean updateAcbg(Map<String, String> updateParam);
}
