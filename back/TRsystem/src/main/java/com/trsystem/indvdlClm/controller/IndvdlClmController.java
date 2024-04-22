package com.trsystem.indvdlClm.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trsystem.indvdlClm.domain.IndvdlClmDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class IndvdlClmController {

    @PostMapping(value = "/boot/indvdlClm/insertPrjctMM")
    public int insertPrjctMM (@RequestBody List<Map<String, Object>> params){
        return IndvdlClmDomain.insertPrjctMM(params);
    }

    // 프로젝트근무시간저장
    @PostMapping(value = "/boot/indvdlClm/insertPrjctMmAply" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Map<String, Object>> insertPrjctMmAply (@RequestPart(required = false) String insertWorkHourList,
                                                        @RequestPart(required = false) String deleteWorkHourList) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();

        List<Map<String, Object>> insertWorkHourMap = new ArrayList<>();
        List<Map<String, Object>> deleteWorkHourMap = new ArrayList<>();

        insertWorkHourMap = mapper.readValue(insertWorkHourList,ArrayList.class);
        deleteWorkHourMap = mapper.readValue(deleteWorkHourList,ArrayList.class);

        return IndvdlClmDomain.insertPrjctMmAply(insertWorkHourMap, deleteWorkHourMap);
    }

    // 휴가결재저장
    @PostMapping(value = "/boot/indvdlClm/insertVcatnAtrz", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String insertVcatnAtrz (
            @RequestPart(required = false) String elctrnAtrzId,
            @RequestPart(required = false) List<MultipartFile> attachments,
            @RequestPart(required = false) String elctrnTbNm,
            @RequestPart(required = false) String insertElctrnValue,
            @RequestPart(required = false) String vcatnTbNm,
            @RequestPart(required = false) String insertVcatnValue,
            @RequestPart(required = false) String atrzLnTbNm,
            @RequestPart(required = false) String insertAtrzLnValue,
            @RequestPart(required = false) String refrnTbNm,
            @RequestPart(required = false) String insertRefrnValue
            ) throws JsonProcessingException, SQLException {

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> elctrnAtrzIdValue = mapper.readValue(elctrnAtrzId,Map.class);
            Map<String, Object> elctrnTbMap = mapper.readValue(elctrnTbNm,Map.class);
            Map<String, Object> insertElctrnMap = mapper.readValue(insertElctrnValue,Map.class);
            Map<String, Object> vcatnTbMap = mapper.readValue(vcatnTbNm,Map.class);
            Map<String, Object> insertVcatnMap = mapper.readValue(insertVcatnValue,Map.class);
            Map<String, Object> atrzLnTbMap = mapper.readValue(atrzLnTbNm,Map.class);
            List<Map<String, Object>> insertAtrzLnMap = mapper.readValue(insertAtrzLnValue,ArrayList.class);
            Map<String, Object> refrnTbMap = mapper.readValue(refrnTbNm,Map.class);
            List<Map<String, Object>> insertRefrnMap = mapper.readValue(insertRefrnValue,ArrayList.class);

        return IndvdlClmDomain.insertVcatnAtrz(
                elctrnAtrzIdValue,
                elctrnTbMap,
                insertElctrnMap,
                vcatnTbMap,
                insertVcatnMap,
                atrzLnTbMap,
                insertAtrzLnMap,
                refrnTbMap,
                insertRefrnMap,
                attachments
        );
    }

    // 프로젝트근무시간요청취소
    @PostMapping(value = "/boot/indvdlClm/updatePrjctMmAply")
    public List<Map<String, Object>> updatePrjctMmAply (@RequestBody List<Map<String, Object>> params){
        return IndvdlClmDomain.updatePrjctMmAply(params);
    }

    // 휴가신청 승인_취소
    @PostMapping(value = "/boot/indvdlClm/updateVcatnMng")
    public List<Map<String, Object>> updateVcatnMng (@RequestBody Map<String, Object> params) throws SQLException{
        return IndvdlClmDomain.updateVcatnMng(params);
    }
    
    // 문화체련비 등록 시 청구금액 가산
    @PostMapping(value = "/boot/indvdlClm/plusClturPhstrnActCt")
    public int plusClturPhstrnActCt (@RequestBody Map<String, Object> param){
        return IndvdlClmDomain.plusClturPhstrnActCt(param);
    }

    // 문화체련비 삭제 시 청구금액 감산
    @PostMapping(value = "/boot/indvdlClm/minusClturPhstrnActCt")
    public int minusClturPhstrnActCt (@RequestBody Map<String, Object> param){
        return IndvdlClmDomain.minusClturPhstrnActCt(param);
    }

    // 문화체련비 변경 시 청구금액 재계산
    @PostMapping(value = "/boot/indvdlClm/editClturPhstrnActCt")
    public int editClturPhstrnActCt (@RequestBody Map<String, Object> param){
        return IndvdlClmDomain.editClturPhstrnActCt(param);
    }
}
