package com.trsystem.security.jwt;

import com.trsystem.sysMng.domain.SysMngUser;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * -Response-
 * 사용자 정보 반환 + token Dto
 */

@Getter
@Setter
@NoArgsConstructor
public class TokenDto {
    private String token;
    private Date expirationTime;
    private List<String> authorities;
    private List<Map<String, Object>> deptInfo;
    private Map<String, Object> userInfo;

    @Builder
    public TokenDto(Map<String, Object> userInfo, String token, Date expirationTime, List<String> authorities, List<Map<String, Object>> deptInfo) {
        this.userInfo = userInfo;
        this.token = token;
        this.expirationTime = expirationTime;
        this.authorities = authorities;
        this.deptInfo = deptInfo;
    }

    public static TokenDto fromEntity(SysMngUser member, String token, Date expirationTime) {
        List<String> authorities = member.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return TokenDto.builder()
                .userInfo(member.getUserInfo())
                .deptInfo(member.getDeptInfo())
                .token(token)
                .expirationTime(expirationTime)
                .authorities(authorities)
                .build();
    }
}
