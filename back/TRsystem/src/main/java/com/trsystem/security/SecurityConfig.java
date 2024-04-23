package com.trsystem.security;

import com.trsystem.security.jwt.JwtAuthenticationEntryPoint;
import com.trsystem.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, HandlerMappingIntrospector introspector) throws Exception {
        return http
                .httpBasic(httpBasic -> httpBasic.disable())
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .authorizeHttpRequests(authorize
                        -> authorize
                        .requestMatchers(new MvcRequestMatcher(introspector,"/boot/sysMng/lgnSkll")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector,"/boot/prjct/**")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector,"/boot/common/**")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector,"/boot/infoInq/**")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector,"/boot/sysMng/**")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector,"/boot/indvdlClm/**")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector,"/boot/humanResourceMng/**")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector,"/boot/humanResourceMng/**")).hasAuthority("VTW00307")

//                        .requestMatchers("/boot/prjct/**").hasRole("USER")
//                        .requestMatchers("/boot/**").hasRole("USER")
//                        .requestMatchers("/boot/**").hasRole("USER")
//                        .requestMatchers("/board/{boardId}/comment/**").hasRole("USER")
//                        .requestMatchers("/board/{boardId}/file/**").hasRole("USER")
                )

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(excep -> excep.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
