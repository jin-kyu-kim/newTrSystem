package com.trsystem.security;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.security.auth.login.FailedLoginException;
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FailedLoginException.class)
    public ResponseEntity<String> handleFailedLoginException(FailedLoginException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)  // 401 Status Code
                .body("로그인 실패: " + ex.getMessage());  // 클라이언트에 전달할 메시지
    }
}
