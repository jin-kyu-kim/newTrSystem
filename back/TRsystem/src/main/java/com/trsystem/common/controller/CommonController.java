package com.trsystem.common.controller;

import com.trsystem.common.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CommonController {   
 
    private final CommonService commonService;

    @PostMapping(value = "/boot/common/commonInsert")
    public int insertData(@RequestBody List<Map<String, Object>> params){
        return commonService.insertData(params);
    }

    @PostMapping(value = "/boot/common/commonUpdate")
    public int updateData(@RequestBody List<Map<String, Object>> params){
        return commonService.updateData(params);
    }

    @PostMapping(value = "/boot/common/commonDelete")
    public int deleteData(@RequestBody List<Map<String, Object>> params){
        return commonService.deleteData(params);
    }

    @PostMapping(value = "/boot/common/commonSelect")
    public List<Map<String, Object>> commonSelect(@RequestBody List<Map<String, Object>> params){
        return commonService.commonSelect(params);
    }
    @PostMapping(value = "/boot/common/commonGetMax")
    public int commonGetMax(@RequestBody List<Map<String, Object>> params){
        return commonService.commonGetMax(params);
    }
    @PostMapping(value = "/boot/common/queryIdSearch")
    public List<Map<String, Object>> queryIdSearch(@RequestBody Map<String, Object> param){
        return commonService.queryIdSearch(param);
    }
}
