package com.trsystem.common.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trsystem.common.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
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
    @PostMapping(value = "/boot/common/insertlongText", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public int longTextInsert(@RequestPart(required = false) List<MultipartFile> attachments,
                              @RequestPart String tbNm, @RequestPart String data) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> mapData = mapper.readValue(data,Map.class);
        Map<String, Object> tbNmData = mapper.readValue(tbNm,Map.class);
        return commonService.insertFile(tbNmData, mapData, attachments);

    }
    @PostMapping(value = "/boot/common/getFile")
    public ResponseEntity<Resource> getFile(@RequestBody Map<String, Object> oneData) {
        String strgFileNm = (String) oneData.get("strgFileNm");
        String realFileNm = (String) oneData.get("realFileNm");
        realFileNm = URLEncoder.encode(realFileNm, StandardCharsets.UTF_8);
        ClassLoader classLoader = getClass().getClassLoader();
        URL resources = classLoader.getResource("upload/" + strgFileNm);

        Resource resource;
        try{
            resource = new UrlResource(resources.toURI());
            if(resource.exists() && resource.isReadable()){
                String contentType = Files.probeContentType(Paths.get(resources.toURI()));

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(contentType));
                headers.setContentDispositionFormData("attachment", realFileNm);

                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            }
        } catch (IOException | URISyntaxException e){
            e.printStackTrace();
        }
        return ResponseEntity.notFound().build();
    }

}
