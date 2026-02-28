package com.example.ai_recruiter.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import jakarta.annotation.PostConstruct;


@Service
@RequiredArgsConstructor
public class OllamaService {

    private static final ObjectMapper mapper = new ObjectMapper();

    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    public Optional<String> ask(String userPrompt) {
        try {

            String prompt = """
You are an AI assistant.
Rules:
- Respond ONLY in English
- Do NOT translate
- Do NOT explain unless asked
- Do NOT use any other language
- Be concise and professional

User request:
%s
""".formatted(userPrompt);

            Map<String, Object> body = Map.of(
                    "model", "qwen2.5:7b-instruct",
                    "prompt", prompt,
                    "stream", false,
                    "options", Map.of(
                            "temperature", 0.2,
                            "num_predict", 200,
                            "top_p", 0.9,
                            "top_k", 40
                    )
            );

            String json = mapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:11434/api/generate"))
                    .timeout(Duration.ofMinutes(5))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                System.err.println("⚠ Ollama HTTP error: " + response.body());
                return Optional.empty();
            }

            Map<?, ?> result = mapper.readValue(response.body(), Map.class);
            Object text = result.get("response");

            return text == null
                    ? Optional.empty()
                    : Optional.of(text.toString().trim());

        } catch (Exception e) {
            System.err.println("⚠ Ollama failed: " + e.getMessage());
            return Optional.empty();
        }
    }
}

