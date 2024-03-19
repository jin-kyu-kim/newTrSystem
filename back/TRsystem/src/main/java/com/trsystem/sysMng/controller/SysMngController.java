package com.trsystem.sysMng.controller;

import com.trsystem.sysMng.domain.SysMngDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SysMngController {

    @PostMapping("/boot/sysMng/insertAuth")
    public int insertAuth(@RequestBody Map<String, Object> params){
        return SysMngDomain.createAuth(params);
    }

    @PostMapping("/boot/sysMng/deleteAuth")
    public int deleteAuth(@RequestBody Map<String, Object> params){
        return SysMngDomain.removeAuth(params);
    }
}
