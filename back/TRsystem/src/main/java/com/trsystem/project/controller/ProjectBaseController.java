package com.trsystem.project.controller;

import com.trsystem.project.domain.ProjectBaseDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProjectBaseController {

    private final ProjectBaseDomain projectBaseDomain = new ProjectBaseDomain();

    //프로젝트 초안 생성 후 생성 프로젝트 조회
    @PostMapping(value = "/boot/prjct/prjctMng/prjctBsisInfoReg/prjctBsisInfoReg")
    public Map<String, Object> insertProject(@RequestBody Map<String, Object> projectDto) throws Exception {
        List<Map<String, Object>> aa = new ArrayList<>();
        aa.add(projectDto);
        boolean test = ProjectBaseDomain.validMmnyHnfPrmpc(aa);

        return null;
    }

    //프로젝트 자사직원 원가 상세정보 입력 후 자사직원 투입정보 조회
    @PostMapping(value = "/boot/prjct/prjctReg/mmnyHnfPrmpc/mmnyHnfPrmpcStrg")
    public Map<String, Object> insertMmnyEmp(@RequestBody List<Map<String, Object>> mmnyLbrcoPrmpc) {
        return null;
    }

    //프로젝트 통제성 경비 상세정보 입력 후 통제성경비 정보 조회
    @PostMapping(value = "/boot/prjct/prjctReg/cntrlExpensPrmpc/cntrlExpensPrmpcStrg")
    public Map<String, Object> insertExpensPrmpc(@RequestBody List<Map<String, Object>> expensPrmpc) {
        return null;
    }
}
