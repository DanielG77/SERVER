package com.tournaments.infrastructure.ai;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AiHealthStatus {
    @JsonProperty("status")
    private String status;

    @JsonProperty("providers")
    private Map<String, ProviderStatus> providers;

    public AiHealthStatus() {}

    public AiHealthStatus(String status, Map<String, ProviderStatus> providers) {
        this.status = status;
        this.providers = providers;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, ProviderStatus> getProviders() { return providers; }
    public void setProviders(Map<String, ProviderStatus> providers) { this.providers = providers; }

    public static class ProviderStatus {
        @JsonProperty("available")
        private Boolean available;

        @JsonProperty("latencyMs")
        private Long latencyMs;

        @JsonProperty("model")
        private String model;

        public ProviderStatus() {}

        public ProviderStatus(Boolean available, Long latencyMs, String model) {
            this.available = available;
            this.latencyMs = latencyMs;
            this.model = model;
        }

        public Boolean getAvailable() { return available; }
        public void setAvailable(Boolean available) { this.available = available; }

        public Long getLatencyMs() { return latencyMs; }
        public void setLatencyMs(Long latencyMs) { this.latencyMs = latencyMs; }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
    }
}
