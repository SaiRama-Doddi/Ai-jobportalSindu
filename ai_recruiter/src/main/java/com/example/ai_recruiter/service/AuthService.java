package com.example.ai_recruiter.service;



import com.example.ai_recruiter.dto.AuthResponse;
import com.example.ai_recruiter.dto.LoginRequest;
import com.example.ai_recruiter.dto.RegisterRequest;
import com.example.ai_recruiter.dto.UserProfileResponse;
import com.example.ai_recruiter.entity.Role;
import com.example.ai_recruiter.entity.User;
import com.example.ai_recruiter.repo.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    // REGISTER
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(Role.valueOf(request.getRole()));

        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception ignored) {
            // Public user
        }

        /* ================= PUBLIC REGISTRATION ================= */
        if (currentUser == null) {
            // Public can only create Candidate or HR
            if (newUser.getRole() != Role.CANDIDATE && newUser.getRole() != Role.HR) {
                throw new RuntimeException("Public users can only register as Candidate or HR");
            }
        }

        /* ================= HR LOGGED IN ================= */
        if (currentUser != null && currentUser.getRole() == Role.HR) {
            // HR cannot create HR
            if (newUser.getRole() == Role.HR) {
                throw new RuntimeException("HR cannot create another HR");
            }

            // HR can create Interviewer
            if (newUser.getRole() == Role.INTERVIEWER) {
                newUser.setCreatedByHr(currentUser);
            }
        }

        /* ================= ADMIN LOGGED IN ================= */
        if (currentUser != null && currentUser.getRole() == Role.ADMIN) {
            // Admin can create HR or Interviewer (no restriction)
        }

        userRepository.save(newUser);
        return "User registered successfully";
    }




    // LOGIN → return JWT token
    public AuthResponse login(LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password!");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        String jwt = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getAuthorities()
        ));

        return new AuthResponse(
                jwt,
                user.getRole().name(),  // HR / CANDIDATE / ADMIN
                user.getName()
        );

    }


    public UserProfileResponse getMyProfile() {

        User user = userService.getCurrentUser();

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
