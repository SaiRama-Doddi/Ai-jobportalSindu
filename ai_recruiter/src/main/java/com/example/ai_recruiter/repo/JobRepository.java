package com.example.ai_recruiter.repo;

import com.example.ai_recruiter.entity.Job;
import com.example.ai_recruiter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job,Long> {
    List<Job> findByHr(User hr);

    @Query(value = """
SELECT DISTINCT j.*
FROM jobs j,
jsonb_array_elements_text(j.required_skills) skill
WHERE LOWER(skill) = ANY(:skills)
""", nativeQuery = true)
    List<Job> findJobsMatchingSkills(String[] skills);

}
