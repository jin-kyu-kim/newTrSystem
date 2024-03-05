package com.trsystem.infoInq.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trsystem.common.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class NoticeController {

    private final CommonService commonService;

    @PostMapping(value = "/boot/common/noticeInsert")
    public int insertData(@RequestPart(required = false) List<MultipartFile> attachments,
                          @RequestPart String tbNm, @RequestPart String data) throws JsonProcessingException {
        List<Map<String, Object>> params = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> mapData = mapper.readValue(data, Map.class);

        Map<String, Object> tbNmMap = new HashMap<>();
        tbNmMap.put("tbNm",tbNm);
        params.add(tbNmMap);
        params.add(mapData);

        return commonService.insertData(params);
    }

}
