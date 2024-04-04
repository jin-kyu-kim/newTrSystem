package com.trsystem.sysMng.controller;

import com.trsystem.sysMng.domain.SysMngDomain;
import com.trsystem.sysMng.service.SysMngService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class SysMngController {

    private final SysMngService userDetails;

    public SysMngController(SysMngService userDetails) {
        this.userDetails = userDetails;
    }
    @PostMapping("/boot/sysMng/insertAuth")
    public int insertAuth(@RequestBody Map<String, Object> params){
        return SysMngDomain.createAuth(params);
    }

    @PostMapping("/boot/sysMng/deleteAuth")
    public int deleteAuth(@RequestBody Map<String, Object> params){
        return SysMngDomain.removeAuth(params);
    }

    @PostMapping(value = "/boot/sysMng/lgnSkll")
    public ResponseEntity<UserDetails> loginCheck(@RequestBody Map<String, Object> loginInfo) {
        return userDetails.login(loginInfo);
    }
   
    
    @PostMapping(value = "/boot/sysMng/resetPswd")
    public ResponseEntity<String> resetPswd(@RequestBody Map<String, Object> loginInfo) {
        return userDetails.resetUserPswd(loginInfo);
    }
}
