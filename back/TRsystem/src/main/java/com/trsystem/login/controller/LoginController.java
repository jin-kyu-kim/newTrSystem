package com.trsystem.login.controller;

import com.trsystem.login.domain.LoginDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LoginController {
    @PostMapping(value = "/boot/trs/sysMng/lgnSkll")
    public Map<String, Object> loginCheck(@RequestBody Map<String, Object> loginInfo) {
        return LoginDomain.loginValid(loginInfo);
    }
}
