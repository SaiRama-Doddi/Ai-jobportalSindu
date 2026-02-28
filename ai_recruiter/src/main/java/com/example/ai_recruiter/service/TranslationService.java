package com.example.ai_recruiter.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TranslationService {

    private final OllamaService ollamaService;

    public String translate(String text, String from, String to) {

        if (text == null || text.isBlank()) return text;
        if (from == null || to == null) return text;
        if (from.equalsIgnoreCase(to)) return text;
        if (to.equalsIgnoreCase("EN")) return text;

        String language =
                to.equalsIgnoreCase("HI") ? "Hindi" :
                        to.equalsIgnoreCase("TE") ? "Telugu" :
                                "English";
        String prompt = """
You are a professional translation engine.

Rules:
- Translate the COMPLETE text
- Preserve question structure
- Do NOT explain
- Do NOT add extra words
- Do NOT summarize
- Output ONLY the translated text

Target language: %s

Text:
%s
""".formatted(language, text);


        return ollamaService.ask(prompt)
                .map(String::trim)
                .orElse(text);
    }
}
