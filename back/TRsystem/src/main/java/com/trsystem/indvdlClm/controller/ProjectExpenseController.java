package com.trsystem.indvdlClm.controller;

import com.trsystem.indvdlClm.domain.ProjectExpenseDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProjectExpenseController {

    @PostMapping(value = "/boot/indvdlClm/prjctExpns/selectPrjctMM")
    public List<Map<String, Object>> selectPrjctMM (@RequestBody List<Map<String, Object>> params){
        return ProjectExpenseDomain.selectPrjctMM(params);
    }
}
