package com.tournaments.infrastructure.ai.impl;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.tournaments.infrastructure.ai.AiProvider;

@Component
public class MistralProvider implements AiProvider {

    private static final Logger logger = LoggerFactory.getLogger(MistralProvider.class);
    private static final String NAME = "mistral";
    private static final String API_URL = "https://api.mistral.ai/v1/chat/completions";
    private static final Duration TIMEOUT = Duration.ofSeconds(5);

    @Value("${ai.mistral.api-key:}")
    private String apiKey;

    private final HttpClient httpClient;

    public MistralProvider() {
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(TIMEOUT)
            .build();
    }

    @Override
    public String generateExplanation(String query, String tournamentData) throws Exception {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("Mistral API key not configured");
        }

        String prompt = String.format(
            "Explica brevemente (máximo 20 palabras) por qué este torneo encaja con la búsqueda.\n\n" +
            "Búsqueda: %s\n\n" +
            "Torneo: %s",
            query, tournamentData
        );

        String requestBody = String.format(
            "{\"model\":\"mistral-small-latest\",\"messages\":[{\"role\":\"user\",\"content\":\"%s\"}],\"max_tokens\":30}",
            escapeJson(prompt)
        );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .timeout(TIMEOUT)
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Mistral API error: " + response.body());
        }

        return extractContent(response.body());
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean isHealthy() {
        if (apiKey == null || apiKey.isEmpty()) {
            return false;
        }

        try {
            String requestBody = "{\"model\":\"mistral-small-latest\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}],\"max_tokens\":5}";
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .timeout(Duration.ofSeconds(2))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            logger.warn("Mistral health check failed", e);
            return false;
        }
    }

    private String extractContent(String response) {
        int start = response.indexOf("\"content\":\"");
        if (start == -1) return "Torneo relevante";

        int end = response.indexOf("\"", start + 11);
        if (end == -1) return "Torneo relevante";

        return response.substring(start + 11, end);
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
    }
}
