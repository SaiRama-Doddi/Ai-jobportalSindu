package com.example.ai_recruiter.security;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/resumes/**").authenticated()
                        .requestMatchers("/api/translate").authenticated()
                        .requestMatchers("/api/resumes/download/**").authenticated()
                        .requestMatchers("/api/resumes/view/**").authenticated()

                        // Candidate
                        .requestMatchers(HttpMethod.POST, "/api/questions/**").hasRole("CANDIDATE")
                        .requestMatchers(HttpMethod.GET, "/api/jobs/recommended").hasRole("CANDIDATE")

                        // HR/Admin
                        .requestMatchers(HttpMethod.POST, "/api/jobs/**").hasAnyRole("HR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/jobs/my").hasAnyRole("HR", "ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/interviews/start/**")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.POST, "/api/interviews/*/submit")
                        .hasRole("CANDIDATE")

                        // Interview APIs
                        .requestMatchers("/api/interviews/**")
                        .hasAnyRole("INTERVIEWER","HR","ADMIN")

                        // Admin
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }



    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /*@Bean
    public KeyPair rsaKeyPair() throws Exception {
        KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
        gen.initialize(4096);
        return gen.generateKeyPair();
    }*/


}
