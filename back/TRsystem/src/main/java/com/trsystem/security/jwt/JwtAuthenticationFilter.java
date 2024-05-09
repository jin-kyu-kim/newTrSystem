package com.trsystem.security.jwt;

import com.trsystem.sysMng.domain.SysMngUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JWT 토큰의 유효성을 검사하고, 인증
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    @Value("${jwt.header}") private String HEADER_STRING;
    @Value("${jwt.prefix}") private String TOKEN_PREFIX;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Thread currentThread = Thread.currentThread();
        // get token
        String header = request.getHeader(HEADER_STRING);
        String username = null;
        String authToken = null;

        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            authToken = header.replace(TOKEN_PREFIX, " ");
            try {
                username = this.jwtTokenUtil.getUsernameFromToken(authToken);
                request.setAttribute("userId", username);
            } catch (IllegalArgumentException ex) {
                log.info("Failed to get user id", ex);
                sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid token format.");
                return; // 요청 처리 중단
            } catch (ExpiredJwtException ex) {
                log.info("Token expired", ex);
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token expired.");
                return; // 요청 처리 중단
            } catch (MalformedJwtException ex) {
                log.info("Invalid JWT", ex);
                sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid JWT.");
                return; // 요청 처리 중단
            } catch (Exception e) {
                log.info("Unable to get JWT Token", e);
                sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error.");
                return; // 요청 처리 중단
            }
        } else {
            log.info("JWT does not begin with Bearer");
        }

        if ((username != null) && (SecurityContextHolder.getContext().getAuthentication() == null)) {

            if (this.jwtTokenUtil.validateToken(authToken, username)) {
                Claims claims = jwtTokenUtil.getAllClaimsFromToken(authToken);
                long expirationTime = claims.getExpiration().getTime();
                long currentTime = System.currentTimeMillis();
                long timeLeft = expirationTime - currentTime; // 남은 시간 계산

                // 만료 10분 전에 새 토큰 발행
                if (timeLeft < 1800000) { // 600000ms = 10 minutes
                    SysMngUser setInfo = userDetailsService.loadUserByUsername(username);
                    String newToken = jwtTokenUtil.generateToken(setInfo); // 새 토큰 생성
                    response.setHeader("Authorization",  newToken); // 응답 헤더에 새 토큰 추가
                }

                List<String> roles = claims.get("roles", List.class);
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
                Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                log.info("Invalid JWT Token !!");
            }
        } else {
            log.info("Username is null or context is not null !!");
        }
        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}
