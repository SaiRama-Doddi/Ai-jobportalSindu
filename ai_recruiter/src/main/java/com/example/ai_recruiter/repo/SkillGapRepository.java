package com.example.ai_recruiter.repo;

import com.example.ai_recruiter.entity.SkillGap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillGapRepository extends JpaRepository<SkillGap,Long> {
    Optional<SkillGap> findByApplicationId(Long appId);



    // ✅ NEW
    Optional<SkillGap> findByApplication_Id(Long applicationId);
}
