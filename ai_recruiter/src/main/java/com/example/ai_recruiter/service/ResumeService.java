package com.example.ai_recruiter.service;

import com.example.ai_recruiter.dto.ResumeResponse;
import com.example.ai_recruiter.entity.Resume;
import com.example.ai_recruiter.entity.User;
import com.example.ai_recruiter.repo.ResumeRepository;
import com.example.ai_recruiter.utils.RegexUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeCryptoService cryptoService;
    private final UserService userService;
    private final Tika tika = new Tika();

    /* =====================================================
       UPLOAD / REPLACE RESUME  (VERSIONING APPROACH)
       ===================================================== */
    @Transactional
    public void handleUpload(MultipartFile file) throws Exception {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        User candidate = userService.getCurrentUser();

        byte[] bytes = file.getBytes();

        ResumeCryptoService.EncryptionResult enc =
                cryptoService.encrypt(bytes);

        String text = tika.parseToString(file.getInputStream());

        Map<String, Object> parsedMap = new HashMap<>();
        parsedMap.put("email", RegexUtils.extractEmail(text));
        parsedMap.put("phone", RegexUtils.extractPhone(text));
        parsedMap.put("skills", RegexUtils.extractSkills(text));
        parsedMap.put("experience", RegexUtils.extractExperience(text));
        parsedMap.put("education", RegexUtils.extractEducation(text));

        String json = new ObjectMapper().writeValueAsString(parsedMap);

        // ✅ SAVE AS NEW VERSION (NO DELETE)
        Resume resume = Resume.builder()
                .candidate(candidate)
                .fileName(file.getOriginalFilename())
                .encryptedFile(enc.encryptedFile())
                .encryptedAesKey(enc.encryptedAesKey())
                .iv(enc.iv())
                .parsedJson(json)
                .uploadedAt(Instant.now())
                .build();

        resumeRepository.save(resume);
    }

    /* =====================================================
       GET LATEST RESUME FOR PROFILE PAGE
       ===================================================== */
    @Transactional(readOnly = true)
    public ResumeResponse getResumeForCurrentUser() {

        User candidate = userService.getCurrentUser();

        Resume resume = resumeRepository
                .findTopByCandidateOrderByUploadedAtDesc(candidate)
                .orElse(null);

        if (resume == null) {
            return new ResumeResponse(false, null, null, null, null);
        }

        return new ResumeResponse(
                true,
                resume.getId(),
                resume.getFileName(),
                resume.getUploadedAt(),
                "/api/resumes/view/" + resume.getId()
        );
    }

    /* =====================================================
       GET RESUME WITH ROLE SECURITY
       ===================================================== */
    @Transactional(readOnly = true)
    public Resume getResume(Long resumeId) {

        User currentUser = userService.getCurrentUser();

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String role = String.valueOf(currentUser.getRole());

        if ("CANDIDATE".equals(role) &&
                resume.getCandidate().getId().equals(currentUser.getId())) {
            return resume;
        }

        if ("HR".equals(role) || "ADMIN".equals(role)) {
            return resume;
        }

        throw new RuntimeException("Unauthorized access to resume");
    }

    /* =====================================================
       DECRYPT
       ===================================================== */
    public byte[] decryptResume(Resume resume) throws Exception {
        return cryptoService.decrypt(
                resume.getEncryptedFile(),
                resume.getEncryptedAesKey(),
                resume.getIv()
        );
    }

    /* =====================================================
       MIME TYPE DETECTION
       ===================================================== */
    public String detectMimeType(byte[] fileBytes) {
        try {
            return tika.detect(fileBytes);
        } catch (Exception e) {
            return "application/octet-stream";
        }
    }
}
