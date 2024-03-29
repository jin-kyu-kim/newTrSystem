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

    @PostMapping(value = "/boot/indvdlClm/prjctExpns/selectPrjctMM")
    public List<Map<String, Object>> selectPrjctMM (@RequestBody List<Map<String, Object>> params){
        return IndvdlClmDomain.selectPrjctMM(params);
    }

    @PostMapping(value = "/boot/indvdlClm/prjctExpns/insertPrjctMM")
    public List<Map<String, Object>> insertPrjctMM (@RequestBody List<Map<String, Object>> params){
        return IndvdlClmDomain.insertPrjctMM(params);
    }
}
