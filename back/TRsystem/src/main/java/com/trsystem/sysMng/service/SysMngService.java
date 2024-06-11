package com.trsystem.sysMng.service;

import com.trsystem.common.service.CommonService;
import com.trsystem.security.jwt.CustomUserDetailsService;
import com.trsystem.security.jwt.JwtTokenUtil;
import com.trsystem.security.jwt.TokenDto;
import com.trsystem.sysMng.domain.SysMngUser;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.security.auth.login.FailedLoginException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SysMngService {

    private final PasswordEncoder passwordEncoder;
    private static CommonService commonService;

    private final AuthenticationManager authenticationManager;

    private final CustomUserDetailsService userDetailsService;

    private final JwtTokenUtil jwtTokenUtil;

    private final Map<String, Integer> loginAttemptsMap = new HashMap<>();

    @Autowired
    public SysMngService(PasswordEncoder passwordEncoder, CommonService commonService, AuthenticationManager authenticationManager, CustomUserDetailsService userDetailsService, JwtTokenUtil jwtTokenUtil) {
        this.passwordEncoder = passwordEncoder;
        SysMngService.commonService = commonService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public TokenDto login(Map<String, Object> request) throws FailedLoginException {
        String empno = request.get("empno").toString();
        String password = request.get("password").toString();
        try {
            SysMngUser setInfo = userDetailsService.loadUserByUsername(empno);
            increaseLoginAttempts(empno);

            if (isAccountLocked(empno)) {
                throw new FailedLoginException("계정이 잠겼습니다. 인사팀에 문의 해주세요.");
            }

            // 입력된 비밀번호와 저장된 비밀번호 비교
            if (passwordEncoder.matches(password, setInfo.getPassword())) {
                String token = jwtTokenUtil.generateToken(setInfo);
                resetLoginAttempts(empno);
                return TokenDto.fromEntity(setInfo, token, jwtTokenUtil.getExpirationDateFromToken(token));
            } else {
                throw new FailedLoginException("비밀번호 오류");
            }
        }catch (UsernameNotFoundException e){
            throw new FailedLoginException("사번을 찾을 수 없습니다.");
        }
    }
    public TokenDto tokenExtension(String token) {

        String empId = jwtTokenUtil.getUsernameFromToken(token);
        SysMngUser setInfo = userDetailsService.loadUserByUsername(empId);

        // 입력된 비밀번호와 저장된 비밀번호 비교
        if (!empId.isEmpty()) {
            token = jwtTokenUtil.generateToken(setInfo);
            Authentication authentication = new UsernamePasswordAuthenticationToken(setInfo.getUsername(), setInfo.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            SecurityContextHolder.getContext();
            return TokenDto.fromEntity(setInfo, token, jwtTokenUtil.getExpirationDateFromToken(token));
        } else {
            throw new ExpiredJwtException(null, null, "이미 만료되었습니다.");
        }
    }

    public ResponseEntity<String> resetUserPswd(Map<String, Object> request) {
        List<Map<String, Object>> param = new ArrayList<>();
        Map<String, Object> tbNm = new HashMap<>();
        Map<String, Object> condition = new HashMap<>();
        String empno = (String) request.get("empno");
        String empId = (String) request.get("empId");

        tbNm.put("tbNm", "LGN_USER");
        request.put("pswd",passwordEncoder.encode(empno));
        request.put("intlPwsdYn","Y");
        request.put("usePsbltyAcntYn","Y");
        condition.put("empId", empId);
        param.add(tbNm);
        param.add(condition);

        //lgn_user에 데이터가 있는지 확인
        List<Map<String, Object>> search = commonService.commonSelect(param);

        int result;
        if(!search.isEmpty()) {
        	if(empno != search.get(0).get("empno").toString()) {
        	    request.clear();
        	    request.put("empno",empno);
        	    request.put("pswd",passwordEncoder.encode(empno));
                request.put("intlPwsdYn","Y");
                request.put("usePsbltyAcntYn","Y");
        	    param.clear();
        	    param.add(tbNm);
            	param.add(request);
            	param.add(condition);
            	result = commonService.updateData(param);
            	if (result > 0) {
                    resetLoginAttempts(empno);
                    return ResponseEntity.ok("성공");
                } else {
                    return ResponseEntity.ok("실패");
                }
        	}else {
        		param.clear();
            	param.add(tbNm);
            	param.add(request);
            	param.add(condition);
            	result = commonService.updateData(param);
	            	if (result > 0) {
	                    return ResponseEntity.ok("성공");
	                } else {
	                    return ResponseEntity.ok("실패");
	                }
        	}
        }else {
        	param.clear();
        	param.add(tbNm);
        	param.add(request);
        	result = commonService.insertData(param);
        	 if (result > 0) {
                 // 인증 객체 생성
                 return ResponseEntity.ok("성공");
             } else {
                 return ResponseEntity.ok("실패");
             }
        }
    }
    
    public ResponseEntity<String> changePwd(Map<String, Object> request) {
        String empId = (String) request.get("empId");
        String oldPwd = (String) request.get("oldPwd");
        String newPwd = (String) request.get("newPwd");

        UserDetails setInfo = userDetailsService.loadUserByUsername(empId);

        ResponseEntity<String> result;

        // 입력된 비밀번호와 저장된 비밀번호 비교
        if (passwordEncoder.matches(oldPwd, setInfo.getPassword())) {
            // 인증 객체 생성
            Authentication authentication = new UsernamePasswordAuthenticationToken(setInfo.getUsername(), setInfo.getPassword(), setInfo.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Map<String, Object> tbNm = new HashMap<>();
            tbNm.put("tbNm", "LGN_USER");

            Map<String, Object> condition = new HashMap<>();
            condition.put("empno", empId);

            // 새로운 비밀번호로 요청 맵 업데이트
            Map<String, Object> updateRequest = new HashMap<>();
            updateRequest.put("pswd", passwordEncoder.encode(newPwd));

            List<Map<String, Object>> param = new ArrayList<>();
            param.add(tbNm);
            param.add(updateRequest);
            param.add(condition);

            // 데이터 업데이트
            int contrastResult = commonService.updateData(param);
            return   ResponseEntity.ok("성공");
                
        } else {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    private void increaseLoginAttempts(String empno) {
        loginAttemptsMap.put(empno, loginAttemptsMap.getOrDefault(empno, 0) + 1);
    }

    private void resetLoginAttempts(String empno) {
        loginAttemptsMap.remove(empno);
    }

    private boolean isAccountLocked(String empno) {
        return loginAttemptsMap.getOrDefault(empno, 0) >= 10;
    }
}
      


    
