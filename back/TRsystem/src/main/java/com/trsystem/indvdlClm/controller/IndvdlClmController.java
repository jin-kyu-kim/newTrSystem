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
import java.text.ParseException;
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

    // 문화체련비 합계테이블 조회
    @PostMapping(value = "/boot/indvdlClm/retrieveClturPhstrnActCt")
    public List<Map<String, Object>> retrieveClturPhstrnActCt (@RequestBody Map<String, Object> param){
        return IndvdlClmDomain.retrieveClturPhstrnActCt(param);
    }

    /* =================================박지환_작업================================= */
    // 프로젝트근무시간임시저장
    @PostMapping(value = "/boot/indvdlClm/insertPrjctMmAplyTemp" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Map<String, Object>> insertPrjctMmAplyTemp (@RequestPart(required = false) String insertPrjctMmTempList) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        List<Map<String, Object>> insertPrjctMmTempListValue = new ArrayList<>();
//
        insertPrjctMmTempListValue = mapper.readValue(insertPrjctMmTempList,ArrayList.class);

        return IndvdlClmDomain.insertPrjctMmAplyTemp(insertPrjctMmTempListValue);
    }

    // 프로젝트근무시간삭제
    @PostMapping(value = "/boot/indvdlClm/deletePrjctMmAply" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Map<String, Object>> deletePrjctMmAply (@RequestPart(required = false) String deletePrjctMmList) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        List<Map<String, Object>> deletePrjctMmListValue = new ArrayList<>();
//
        deletePrjctMmListValue = mapper.readValue(deletePrjctMmList,ArrayList.class);

        return IndvdlClmDomain.deletePrjctMmAply(deletePrjctMmListValue);
    }

    // 프로젝트근무시간승인요청
    @PostMapping(value = "/boot/indvdlClm/insertPrjctMmAply" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Map<String, Object>> insertPrjctMmAply (@RequestPart(required = false) String insertWorkHourList) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        List<Map<String, Object>> insertWorkHourListValue = new ArrayList<>();

        insertWorkHourListValue = mapper.readValue(insertWorkHourList,ArrayList.class);

        return IndvdlClmDomain.insertPrjctMmAply(insertWorkHourListValue);
    }

    // 프로젝트근무시간요청취소
    @PostMapping(value = "/boot/indvdlClm/updatePrjctMmAply")
    public List<Map<String, Object>> updatePrjctMmAply (@RequestBody List<Map<String, Object>> params){
        return IndvdlClmDomain.updatePrjctMmAply(params);
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

    // 휴가신청승인
    @PostMapping(value = "/boot/indvdlClm/updateVcatnMng")
    public List<Map<String, Object>> updateVcatnMng (@RequestBody Map<String, Object> params) throws SQLException{
        return IndvdlClmDomain.updateVcatnMng(params);
    }

    // 휴가취소신청
    @PostMapping(value = "/boot/indvdlClm/reInsertVcatnAtrz", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Map<String, Object>> reInsertVcatnAtrz (
            @RequestPart(required = false) String insertDataMap,
            @RequestPart(required = false) String insertElctrnAtrzMap,
            @RequestPart(required = false) String insertVactnAtrzMap,
            @RequestPart(required = false) String insertAtrzLnList,
            @RequestPart(required = false) String insertRefrnManList
    ) throws SQLException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> insertDataMapValue = mapper.readValue(insertDataMap,Map.class);
        Map<String, Object> insertElctrnAtrzMapValue = mapper.readValue(insertElctrnAtrzMap,Map.class);
        Map<String, Object> insertVactnAtrzMapValue = mapper.readValue(insertVactnAtrzMap,Map.class);
        List<Map<String, Object>> insertAtrzLnListValue = mapper.readValue(insertAtrzLnList,ArrayList.class);
        List<Map<String, Object>> insertRefrnManListValue = mapper.readValue(insertRefrnManList,ArrayList.class);

        return IndvdlClmDomain.reInsertVcatnAtrz(insertDataMapValue, insertElctrnAtrzMapValue, insertVactnAtrzMapValue, insertAtrzLnListValue, insertRefrnManListValue);
    }

    // 휴가신청취소승인
    @PostMapping(value = "/boot/indvdlClm/approvalReInsertVcatnAtrz")
    public List<Map<String, Object>> approvalReInsertVcatnAtrz (@RequestBody Map<String, Object> params) throws ParseException {
        System.out.println("==============");
        System.out.println("params : " + params);
        System.out.println("==============");
        return IndvdlClmDomain.approvalReInsertVcatnAtrz(params);
    }

    // 휴가신청취소
    @PostMapping(value = "/boot/indvdlClm/deleteVcatnAtrz")
    public int deleteVcatnAtrz (@RequestBody Map<String, Object> dataMap) throws SQLException{
        return IndvdlClmDomain.deleteVcatnAtrz(dataMap);
    }

    // 직원휴직저장
    @PostMapping(value = "/boot/indvdlClm/insertEmpLeave", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String insertEmpLeave (
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

        return IndvdlClmDomain.insertEmpLeave(
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

    // 직원휴직승인
    @PostMapping(value = "/boot/indvdlClm/updateEmpLeave")
    public List<Map<String, Object>> updateEmpLeave (@RequestBody Map<String, Object> params) throws {
        return IndvdlClmDomain.updateEmpLeave(params);
    }

    /* =================================박지환_작업================================= */

}
