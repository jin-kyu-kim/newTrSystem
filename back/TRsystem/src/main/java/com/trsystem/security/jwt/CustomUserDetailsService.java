package com.trsystem.security.jwt;

import com.trsystem.sysMng.domain.SysMngUser;
import org.apache.ibatis.session.SqlSession;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DaoAuthenticationProvider 구현
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final SqlSession sqlSession;

    public CustomUserDetailsService(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Override
    public SysMngUser loadUserByUsername(String empno) throws UsernameNotFoundException {
        Map<String, Object> reltSet = new HashMap<>();
        Map<String, Object> user =  sqlSession.selectOne("com.trsystem.mybatis.mapper.sysMngMapper.userInfo",empno);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + empno);
        }

        List<Map<String, Object>> authorities = sqlSession.selectList("com.trsystem.mybatis.mapper.sysMngMapper.userAuth",user.get("empId").toString());
        List<Map<String, Object>> deptInfo = sqlSession.selectList("com.trsystem.mybatis.mapper.sysMngMapper.userDept",user.get("empId").toString());
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
        List<Map<String, Object>> authorities = (List<Map<String, Object>>) userData.get("authorities");
        List<Map<String, Object>> deptInfo = (List<Map<String, Object>>) userData.get("deptInfo");
        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
        for (Map<String, Object> authority : authorities) {
            authorityList.add(new SimpleGrantedAuthority(authority.get("authrtCd").toString()));
        }
        // UserDetails 객체를 생성하여 반환합니다.
        return new SysMngUser(
                (String) empId,
                (String) pswd,
                userInfo,
                deptInfo,
                authorityList
        );
    }
}
