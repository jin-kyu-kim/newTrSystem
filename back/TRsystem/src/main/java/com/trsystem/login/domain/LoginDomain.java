package com.trsystem.login.domain;

import com.trsystem.common.service.CommonService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class LoginDomain {

    private static CommonService commonService;
//    private static SecurityConfig securityConfig;

    public static Map<String, Object> loginValid(Map<String, Object> param){
        if(param.get("pswd").toString().isEmpty()){
            return null;
        }

//        String encodedPassword = securityConfig.passwordEncoder().encode(param.get("pswd").toString());
        String encodedPassword = new BCryptPasswordEncoder().encode(param.get("pswd").toString());

        param.put("pswd", encodedPassword);
        param.put("queryId", "login.getCookies");

        List<Map<String, Object>> resultSet = commonService.queryIdSearch(param);

        Map<String, Object> result = null;
        if(!resultSet.isEmpty()){
            result = resultSet.get(0);
        }

        return result;
    }
}
