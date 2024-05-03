package com.trsystem.sysMng.domain;

import com.trsystem.common.service.CommonService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Component
@NoArgsConstructor
public class SysMngDomain {

    private static CommonService commonService;

    @Autowired
    public SysMngDomain(CommonService commonService){
        SysMngDomain.commonService = commonService;
    }

    @Transactional
    public static int createAuth(Map<String, Object> params) {
        int result = 0;

        List<Map<String, Object>> authGroup = (List<Map<String, Object>>) params.get("dataParam");
        List<Map<String, Object>> authMapng = (List<Map<String, Object>>) params.get("cdParam");
        List<Map<String, Object>> mapngParam = new ArrayList<>();

        try{
            if(authGroup.size() > 2){
                result += commonService.updateData(authGroup);

                mapngParam.add(authMapng.get(0));
                mapngParam.add(authGroup.get(2));
                commonService.deleteData(mapngParam);
            } else {
                result += commonService.insertData(authGroup);
            }

            for (int i=1; i<authMapng.size(); i++){
                mapngParam.clear();
                mapngParam.add(authMapng.get(0));
                mapngParam.add(authMapng.get(i));
                commonService.insertData(mapngParam);
            }
            return result;
        } catch (Exception e){
            return result;
        }
    }

    @Transactional
    public static int removeAuth(Map<String, Object> params) {
        int result = 0;
        try{
            result += commonService.deleteData((List<Map<String, Object>>)params.get("mapngTb"));
            result += commonService.deleteData((List<Map<String, Object>>)params.get("groupTb"));
            return result;
        } catch (Exception e){
            return result;
        }
    }
    
    @Transactional
    public static Map<String, Object> mainSearch(List<Map<String, Object>> params) {
        Map<String, Object> resultMap = new HashMap<>();

        Map<String, Object> noticeParam = new HashMap<>();
        Map<String, Object> trAplyParam = new HashMap<>();
        Map<String, Object> atrzSttsParam = new HashMap<>();
        Map<String, Object> atrzListParam = new HashMap<>();

        try {
            for (Map<String, Object> param : params) {
                String queryId = (String) param.get("queryId");
                switch (queryId) {
                    case "sysMngMapper.retrieveNotice":
                        noticeParam = param;
                        break;
                    case "sysMngMapper.retrieveInptSttus":
                        trAplyParam = param;
                        break;
                    case "sysMngMapper.retrieveAtrzAplySttus":
                        atrzSttsParam = param;
                        break;
                    case "sysMngMapper.retiveAtrzList":
                        atrzListParam = param;
                        break;
                    default:
                        break;
                }
            }

            resultMap.put("retrieveNotice", commonService.queryIdSearch(noticeParam));
            resultMap.put("retrieveInptSttus", commonService.queryIdSearch(trAplyParam));
            resultMap.put("retrieveAtrzAplySttus", commonService.queryIdSearch(atrzSttsParam));
            resultMap.put("retiveAtrzList", commonService.queryIdSearch(atrzListParam));
            
        } catch (Exception e) {
            e.printStackTrace(); 
        }

        return resultMap;
    }
    
    
}
