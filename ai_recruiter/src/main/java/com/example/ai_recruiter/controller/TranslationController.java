package com.example.ai_recruiter.controller;

import com.example.ai_recruiter.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
@RequestMapping("/api/translate")
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;

    @PostMapping
    public String translate(@RequestBody Map<String, String> req) {
        return translationService.translate(
                req.get("text"),
                req.get("from"),
                req.get("to")
        );
    }
}
