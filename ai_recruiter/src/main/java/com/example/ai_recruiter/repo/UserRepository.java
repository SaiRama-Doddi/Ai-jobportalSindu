package com.example.ai_recruiter.repo;

import com.example.ai_recruiter.entity.Role;
import com.example.ai_recruiter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (Used for Authentication)
    Optional<User> findByEmail(String email);

    // Check if email already exists (for Registration)
    boolean existsByEmail(String email);

    // Find users by role (like HR, INTERVIEWER, etc)
    List<User> findByRole(Role role);
    List<User> findByCreatedByHr(User hr);

}