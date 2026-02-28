package com.example.ai_recruiter.service;

import com.example.ai_recruiter.dto.QuestionResponse;
import com.example.ai_recruiter.dto.SkillGapResponse;
import com.example.ai_recruiter.entity.*;
import com.example.ai_recruiter.repo.ApplicationRepository;
import com.example.ai_recruiter.repo.QuestionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor

public class QuestionService {

    private final OllamaService ollamaService;
    private final ApplicationRepository applicationRepo;
    private final QuestionRepository questionRepo;
    private final ObjectMapper mapper;

    public List<QuestionResponse> generate(Long applicationId) throws Exception {

        Application app = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        List<String> missingSkills = mapper.readValue(
                app.getSkillGap().getMissingSkills(),
                new TypeReference<List<String>>() {}
        );

        List<String> requiredSkills =
                Optional.ofNullable(app.getJob().getRequiredSkills())
                        .orElse(Collections.emptyList());

        List<String> availableSkills = requiredSkills.stream()
                .filter(skill -> !missingSkills.contains(skill))
                .toList();

        /* ================= AI PROMPT (ENGLISH ONLY) ================= */
        String prompt = """
You are a strict JSON generator.

Generate EXACTLY 10 interview questions IN ENGLISH.

Rules:
- Return ONLY valid JSON
- difficulty MUST be EASY | MEDIUM | HARD

Missing Skills: %s

Return ONLY this JSON array:
[
  {"question":"...", "difficulty":"EASY"},
  {"question":"...", "difficulty":"EASY"},
  {"question":"...", "difficulty":"EASY"},
  {"question":"...", "difficulty":"EASY"},
  {"question":"...", "difficulty":"MEDIUM"},
  {"question":"...", "difficulty":"MEDIUM"},
  {"question":"...", "difficulty":"MEDIUM"},
  {"question":"...", "difficulty":"HARD"},
  {"question":"...", "difficulty":"HARD"},
  {"question":"...", "difficulty":"HARD"}
]
""".formatted(missingSkills);

        String response = ollamaService.ask(prompt).orElse("");
        String json = extractJsonArray(response);

        List<Map<String, Object>> aiQuestions;
        try {
            aiQuestions = mapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            aiQuestions = new ArrayList<>();
        }

        /* ================= BUILD QUESTIONS ================= */
        List<Question> questions = new ArrayList<>();

        for (Map<String, Object> q : aiQuestions) {
            if (questions.size() == 10) break;

            questions.add(Question.builder()
                    .application(app)
                    .difficulty(Difficulty.valueOf(q.get("difficulty").toString()))
                    .questionTextEn(q.get("question").toString())
                    .build());
        }

        /* ================= SAFE FALLBACK (VARIED QUESTIONS) ================= */
        List<String> skills = missingSkills.isEmpty()
                ? List.of("the required skill")
                : missingSkills;

        List<String> templates = List.of(
                "Explain your experience with %s",
                "How have you used %s in real projects?",
                "What challenges did you face while working with %s?",
                "Explain core concepts of %s",
                "How do you optimize performance in %s?",
                "What are common mistakes in %s?",
                "Explain advanced features of %s",
                "How do you debug issues in %s?",
                "How does %s compare with alternatives?",
                "Describe a complex problem solved using %s"
        );

        for (int i = questions.size(); i < 10; i++) {
            String skill = skills.get(i % skills.size());
            String questionText = String.format(
                    templates.get(i % templates.size()), skill);

            questions.add(Question.builder()
                    .application(app)
                    .difficulty(
                            i < 4 ? Difficulty.EASY :
                                    i < 7 ? Difficulty.MEDIUM :
                                            Difficulty.HARD
                    )
                    .questionTextEn(questionText)
                    .build());
        }

        saveQuestions(questions);



        return questions.stream()
                .map(q -> new QuestionResponse(
                        q.getId(),
                        q.getDifficulty().name(),
                        q.getQuestionTextEn(),
                        null,
                        new SkillGapResponse(
                                app.getSkillGap().getId(),
                                app.getSkillGap().getMatchScore(),
                                missingSkills,
                                availableSkills
                        )
                ))
                .toList();
    }

    private String extractJsonArray(String response) {
        int s = response.indexOf('[');
        int e = response.lastIndexOf(']');
        if (s == -1 || e == -1) return "[]";
        return response.substring(s, e + 1);
    }

    @Transactional
    public void saveQuestions(List<Question> questions) {
        questionRepo.saveAll(questions);
    }

}
