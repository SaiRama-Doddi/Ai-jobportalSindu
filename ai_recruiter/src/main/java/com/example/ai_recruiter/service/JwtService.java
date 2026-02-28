package com.example.ai_recruiter.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    // Generate JWT Token
    public String generateToken(UserDetails userDetails) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        return JWT.create()
                .withSubject(userDetails.getUsername())   // email
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .sign(algorithm);
    }

    // Extract email (subject) from token
    public String extractUsername(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            return JWT.require(algorithm)
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException e) {
            return null; // Token invalid
        }
    }

    // Validate token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);

        return username != null &&
                username.equals(userDetails.getUsername()) &&
                !isTokenExpired(token);
    }

    // Check expiration
    private boolean isTokenExpired(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            Date expiresAt = JWT.require(algorithm)
                    .build()
                    .verify(token)
                    .getExpiresAt();

            return expiresAt.before(new Date());

        } catch (JWTVerificationException e) {
            return true;
        }
    }
}
