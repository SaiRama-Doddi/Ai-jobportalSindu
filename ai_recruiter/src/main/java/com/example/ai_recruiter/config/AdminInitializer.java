package com.example.ai_recruiter.config;

import com.example.ai_recruiter.entity.Role;
import com.example.ai_recruiter.entity.User;
import com.example.ai_recruiter.repo.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createAdmin() {

        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {

            User admin = User.builder()
                    .name("Super Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .createdAt(Instant.now())
                    .build();

            userRepository.save(admin);
        }
    }
}