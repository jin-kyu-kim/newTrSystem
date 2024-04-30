package com.trsystem.sysMng.controller;

import com.trsystem.security.jwt.TokenDto;
import com.trsystem.sysMng.domain.SysMngDomain;
import com.trsystem.sysMng.service.SysMngService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.security.auth.login.FailedLoginException;
import java.util.Map;

@RestController
public class SysMngController {

    private final SysMngService userDetails;
    @Value("${jwt.header}") private String HEADER_STRING;
    @Value("${jwt.prefix}") private String TOKEN_PREFIX;

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
    public ResponseEntity<TokenDto> loginCheck(@RequestBody Map<String, Object> loginInfo) throws FailedLoginException {
        TokenDto result = userDetails.login(loginInfo);
        return ResponseEntity.status(HttpStatus.OK).header(result.getToken()).body(result);
    }
    @PostMapping(value = "/boot/sysMng/tokenExtension")
    public ResponseEntity<TokenDto> tokenExtension(HttpServletRequest request) {
        String header = request.getHeader(HEADER_STRING);
        String authToken = header.replace(TOKEN_PREFIX," ");
        TokenDto result = userDetails.tokenExtension(authToken);
        return ResponseEntity.status(HttpStatus.OK).header(result.getToken()).body(result);
    }

    @PostMapping(value = "/boot/sysMng/resetPswd")
    public ResponseEntity<String> resetPswd(@RequestBody Map<String, Object> loginInfo) {
        return userDetails.resetUserPswd(loginInfo);
    }
    @PostMapping(value = "/boot/sysMng/changePwd")
    public ResponseEntity<String> changePwd(@RequestBody Map<String, Object> changePwdInfo) {
        return userDetails.changePwd(changePwdInfo);
    }
}
