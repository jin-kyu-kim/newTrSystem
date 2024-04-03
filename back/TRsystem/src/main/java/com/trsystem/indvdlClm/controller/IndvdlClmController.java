package com.trsystem.indvdlClm.controller;

import com.trsystem.indvdlClm.domain.IndvdlClmDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class IndvdlClmController {

    @PostMapping(value = "/boot/indvdlClm/prjctExpns/insertPrjctMM")
    public int insertPrjctMM (@RequestBody List<Map<String, Object>> params){
        return IndvdlClmDomain.insertPrjctMM(params);
    }

    // 프로젝트근무시간 저장
    @PostMapping(value = "/boot/indvdlClm/prjctMm/insertPrjctMmAply")
    public List<Map<String, Object>> insertPrjctMmAply (@RequestBody List<Map<String, Object>> params){
        return IndvdlClmDomain.insertPrjctMmAply(params);
    }
}
