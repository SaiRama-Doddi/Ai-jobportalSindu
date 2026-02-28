package com.example.ai_recruiter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class OllamaExecutorConfig {

    @Bean
    public ExecutorService ollamaExecutor() {
        return Executors.newSingleThreadExecutor();
    }
}
