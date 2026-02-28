package com.example.ai_recruiter.service;

import com.example.ai_recruiter.dto.SkillGapResponse;
import com.example.ai_recruiter.entity.Application;
import com.example.ai_recruiter.entity.SkillGap;
import com.example.ai_recruiter.repo.ApplicationRepository;
import com.example.ai_recruiter.repo.SkillGapRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGapService {

    private final ApplicationRepository applicationRepo;
    private final SkillGapRepository skillGapRepo;
    private final ObjectMapper mapper;
    private final Logger log = LoggerFactory.getLogger(SkillGapService.class);

    @Transactional
    public SkillGapResponse analyze(Long applicationId) throws Exception {

        Application app = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        /* -------- 1. Candidate skills from resume -------- */
        List<String> candidateSkills = new ArrayList<>();
        String parsedJson = app.getResume().getParsedJson();

        if (parsedJson != null && !parsedJson.isBlank()) {
            try {
                Map<String, Object> map = mapper.readValue(parsedJson, new TypeReference<>() {});
                Object skillsObj = map.get("skills");

                if (skillsObj instanceof List<?>) {
                    candidateSkills = mapper.convertValue(skillsObj, new TypeReference<List<String>>() {});
                } else if (skillsObj instanceof String str) {
                    candidateSkills = Arrays.stream(str.split(","))
                            .map(String::trim)
                            .filter(s -> !s.isBlank())
                            .toList();
                }

                log.info("Candidate Skills Parsed = {}", candidateSkills);

            } catch (Exception e) {
                log.error("Failed to parse resume JSON for applicationId={}", applicationId, e);
            }
        }

        /* -------- 2. Required skills from Job -------- */
        /* -------- 2. Required skills from Job -------- */
        List<String> requiredSkillsRaw = Optional.ofNullable(app.getJob().getRequiredSkills())
                .orElse(Collections.emptyList());

        List<String> requiredSkills = splitSkills(requiredSkillsRaw);


        /* -------- 3. Normalize -------- */
        Set<String> candidateNormalized = candidateSkills.stream()
                .filter(Objects::nonNull)
                .map(this::normalizeSkill)
                .collect(Collectors.toSet());

        Set<String> requiredNormalized = requiredSkills.stream()
                .filter(Objects::nonNull)
                .map(this::normalizeSkill)
                .collect(Collectors.toSet());


        /* -------- 4. Missing & Available -------- */
        List<String> missingSkills = requiredSkills.stream()
                .filter(r -> !candidateNormalized.contains(r.trim().toLowerCase()))
                .collect(Collectors.toList());

        List<String> availableSkills = requiredSkills.stream()
                .filter(r -> candidateNormalized.contains(r.trim().toLowerCase()))
                .collect(Collectors.toList());

        /* -------- 5. Match Score -------- */
        double matchScore = requiredNormalized.isEmpty()
                ? 100.0
                : ((double) availableSkills.size() * 100.0) / requiredNormalized.size();

        /* -------- 6. Persist -------- */
        /* -------- 6. Persist (UPDATE OR INSERT) -------- */

// check if already exists to avoid duplicates
        SkillGap gap = skillGapRepo.findByApplication_Id(applicationId)
                .orElse(new SkillGap());

        gap.setApplication(app);
        gap.setMatchScore(matchScore);
        gap.setMissingSkills(mapper.writeValueAsString(missingSkills));
        gap.setMatchingSkills(mapper.writeValueAsString(availableSkills));

        SkillGap saved = skillGapRepo.save(gap);

// 🔥 THIS LINE FIXES YOUR 0 ISSUE
        app.setMatchScore((float) matchScore);

        app.setSkillGap(saved);
        applicationRepo.save(app);


        /* -------- 7. DTO Response -------- */
        return new SkillGapResponse(
                saved.getId(),
                matchScore,
                missingSkills,
                availableSkills
        );
    }


    private String normalizeSkill(String s) {
        return s.toLowerCase()
                .replaceAll("[^a-z0-9]", "")   // remove dots, spaces, brackets etc
                .trim();
    }

    private List<String> splitSkills(List<String> rawSkills) {
        List<String> result = new ArrayList<>();

        for (String skill : rawSkills) {
            if (skill == null) continue;

            // split by comma, slash, OR 2+ spaces
            String[] parts = skill.split(",|/|\\s{2,}");

            for (String p : parts) {
                String cleaned = p.trim();
                if (!cleaned.isBlank()) result.add(cleaned);
            }
        }

        return result;
    }

}
