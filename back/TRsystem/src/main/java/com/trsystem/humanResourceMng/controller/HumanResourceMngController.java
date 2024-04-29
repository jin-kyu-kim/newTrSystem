package com.trsystem.humanResourceMng.controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trsystem.humanResourceMng.domain.HumanResourceMngDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class HumanResourceMngController {

    /* =================================박지환_작업================================= */
    // 회의실예약저장
    @PostMapping(value = "/boot/humanResourceMng/insertMtgRoomRsvt")
    public int insertMtgRoomRsvt (@RequestBody List<Map<String, Object>> params){
        return HumanResourceMngDomain.insertMtgRoomRsvt(params);
    }

    // 회의실예약취소
    @PostMapping(value = "/boot/humanResourceMng/deleteMtgRoomRsvt")
    public int deleteMtgRoomRsvt (@RequestBody String params){
        return HumanResourceMngDomain.deleteMtgRoomRsvt(params);
    }
    /* =================================박지환_작업================================= */
}
