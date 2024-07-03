//package com.trsystem.security;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.MissingServletRequestParameterException;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.server.ResponseStatusException;
//import org.springframework.web.servlet.NoHandlerFoundException;
//
//import javax.security.auth.login.FailedLoginException;
//@ControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(FailedLoginException.class)
//    public ResponseEntity<String> handleFailedLoginException(FailedLoginException ex) {
//        return ResponseEntity
//                .status(HttpStatus.UNAUTHORIZED)  // 401 Status Code
//                .body("로그인 실패: " + ex.getMessage());  // 클라이언트에 전달할 메시지
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
//        return ResponseEntity
//                .status(HttpStatus.BAD_REQUEST)  // 400 Status Code
//                .body("유효하지 않은 입력: " + ex.getBindingResult().getAllErrors().get(0).getDefaultMessage());
//    }
//
//    // Handle Missing Servlet Request Parameter
//    @ExceptionHandler(MissingServletRequestParameterException.class)
//    public ResponseEntity<String> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex) {
//        return ResponseEntity
//                .status(HttpStatus.BAD_REQUEST)  // 400 Status Code
//                .body("필수 파라미터 누락: " + ex.getParameterName());
//    }
//
//    // Handle No Handler Found
//    @ExceptionHandler(NoHandlerFoundException.class)
//    public ResponseEntity<String> handleNoHandlerFoundException(NoHandlerFoundException ex) {
//        return ResponseEntity
//                .status(HttpStatus.NOT_FOUND)  // 404 Status Code
//                .body("요청한 리소스를 찾을 수 없음: " + ex.getRequestURL());
//    }
//
//    // Handle Response Status
//    @ExceptionHandler(ResponseStatusException.class)
//    public ResponseEntity<String> handleResponseStatusException(ResponseStatusException ex) {
//        return ResponseEntity
//                .status(ex.getStatusCode())  // 상태 코드
//                .body("오류 발생: " + ex.getReason());
//    }
//
//    // Handle General Exception
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleGeneralException(Exception ex) {
//        return ResponseEntity
//                .status(HttpStatus.INTERNAL_SERVER_ERROR)  // 500 Status Code
//                .body("서버 오류: " + ex.getMessage());
//    }
//}
