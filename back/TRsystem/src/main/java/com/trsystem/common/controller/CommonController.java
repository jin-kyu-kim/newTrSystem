package com.trsystem.common.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @PostMapping(value = "/boot/common/queryIdDataControl")
    public int queryIdDataControl(@RequestBody Map<String, Object> param){
        return commonService.queryIdDataControl(param);
    }

    @PostMapping(value = "/boot/common/insertlongText", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public int longTextInsert(@RequestPart(required = false) List<MultipartFile> attachments,
                              @RequestPart(required = false) String tbNm, @RequestPart String data,
                              @RequestPart(required = false) String deleteFiles,
                              @RequestPart(required = false) String idColumn) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> mapData = null;
        if( data != null) {
        	mapData = mapper.readValue(data,Map.class);
        }
        Map<String, Object> tbNmData = mapper.readValue(tbNm,Map.class);

        Map<String, Object> idData = null;
        List<Map<String, Object>> deleteFile = null;

        if(idColumn != null){
            idData = mapper.readValue(idColumn,Map.class);
            if(deleteFiles !=null) {
            	deleteFile = mapper.readValue(deleteFiles, new TypeReference<List<Map<String, Object>>>() {});
            }
        }
        return commonService.insertFile(tbNmData, mapData, attachments, idData, deleteFile);
    }

    @PostMapping(value = "/boot/common/deleteWithFile")
    public int deleteWithFile(@RequestBody Map<String, Object> params){
        return commonService.deleteFile(params);
    }
}
