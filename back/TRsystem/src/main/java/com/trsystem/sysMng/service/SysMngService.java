package com.trsystem.sysMng.service;

import com.trsystem.common.service.CommonService;
import com.trsystem.sysMng.domain.SysMngUser;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SysMngService implements UserDetailsService {

    private final SqlSession sqlSession;

    private final PasswordEncoder passwordEncoder;

    private static SysMngUser sysMngUser;
    private static CommonService commonService;

    @Autowired
    public SysMngService(PasswordEncoder passwordEncoder, SqlSession sqlSession, CommonService commonService) {
        this.passwordEncoder = passwordEncoder;
        this.sqlSession = sqlSession;
        SysMngService.commonService = commonService;
    }

    public Map<String, Object> login(Map<String, Object> request) {
        Map<String, Object> userInfo = new HashMap<>();
        Map<String, Object> relInfo = new HashMap<>();
        String empno = request.get("empno").toString();
        String password = request.get("password").toString();

        SysMngUser setInfo = loadUserByUsername(empno);

        // 입력된 비밀번호와 저장된 비밀번호 비교
        if (passwordEncoder.matches(password, setInfo.getPassword())) {
            Authentication authentication = new UsernamePasswordAuthenticationToken(null, setInfo.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            SecurityContextHolder.getContext();
            relInfo.put("userInfo", setInfo.getUserInfo());
            relInfo.put("deptInfo", setInfo.getDeptInfo());
            relInfo.put("userAuth", setInfo.getAuthorities());
            return relInfo;
        } else {
            relInfo.put("fail",ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null));

            return relInfo;
        }
    }

    @Override
    public SysMngUser loadUserByUsername(String empno) throws UsernameNotFoundException {
        Map<String, Object> reltSet = new HashMap<>();
        Map<String, Object> user =  sqlSession.selectOne("com.trsystem.mybatis.mapper.sysMngMapper.userInfo",empno);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + empno);
        }

        List<Map<String, Object>> authorities = sqlSession.selectList("com.trsystem.mybatis.mapper.sysMngMapper.userAuth",user.get("empId").toString());
        List<Map<String, Object>> deptInfo = sqlSession.selectList("com.trsystem.mybatis.mapper.sysMngMapper.userAuth",user.get("empId").toString());
        reltSet.put("userInfo",user);
        reltSet.put("authorities",authorities);
        reltSet.put("deptInfo",deptInfo);

        return buildUserDetails(reltSet);
    }

    private SysMngUser buildUserDetails(Map<String, Object> userData) {
        // 사용자의 정보로부터 username과 password를 가져옵니다.
        Map<String, Object> userInfo = (Map<String, Object>) userData.get("userInfo");
        String empId = (String) userInfo.get("empId");
        String pswd = (String) userInfo.get("pswd");

        // 사용자의 권한 정보를 가져옵니다.
        List<String> authorities = (List<String>) userData.get("authorities");
        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
        for (String authority : authorities) {
            authorityList.add(new SimpleGrantedAuthority(authority));
        }
        // UserDetails 객체를 생성하여 반환합니다.
        return new SysMngUser(
                (String) empId,
                (String) pswd,
                userInfo,
                (List<Map<String, Object>>) userData.get("deptInfo"),
                authorityList
        );
    }

    public ResponseEntity<String> resetUserPswd(Map<String, Object> request) {
        Map<String, Object> tbNm = new HashMap<>();
        Map<String, Object> condition = new HashMap<>();
        String empno = (String) request.get("empno");
        String empId = (String) request.get("empId");

        tbNm.put("tbNm", "LGN_USER");
        request.clear();
        request.put("pswd",passwordEncoder.encode(empno));
        condition.put("empId", empId);

        List<Map<String, Object>> param = new ArrayList<>();
        param.add(tbNm);
        param.add(request);
        param.add(condition);

        int result = commonService.updateData(param);

        // 입력된 비밀번호와 저장된 비밀번호 비교
        if (result > 0) {
            // 인증 객체 생성
            return ResponseEntity.ok("비밀번호 변경 성공");
        } else {
            return ResponseEntity.ok("비밀번호 변경 실패");
        }
    }
}