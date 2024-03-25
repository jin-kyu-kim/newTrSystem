package com.trsystem.sysMng.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class SysMngUser implements UserDetails {

    private final String username;
    private final String password;
    private final Map<String, Object> userInfo;
    private final List<Map<String, Object>> deptInfo;
    private final Collection<? extends GrantedAuthority> authorities;

    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정이 만료되지 않았음을 반환
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정이 잠기지 않았음을 반환
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 자격 증명이 만료되지 않았음을 반환
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정이 활성화되어 있음을 반환
    }
}
