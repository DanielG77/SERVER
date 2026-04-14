package com.tournaments.presentation.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TournamentSearchResultResponse {
    @JsonProperty("id")
    private UUID id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("game")
    private String game;

    @JsonProperty("description")
    private String description;

    @JsonProperty("priceClient")
    private BigDecimal priceClient;

    @JsonProperty("startAt")
    private LocalDateTime startAt;

    @JsonProperty("endAt")
    private LocalDateTime endAt;

    @JsonProperty("isOnline")
    private Boolean isOnline;

    @JsonProperty("maxPlayers")
    private Integer maxPlayers;

    @JsonProperty("score")
    private Double score;

    @JsonProperty("reason")
    private String reason;

    public TournamentSearchResultResponse() {}

    public TournamentSearchResultResponse(UUID id, String name, String game, String description,
                                          BigDecimal priceClient, LocalDateTime startAt, LocalDateTime endAt,
                                          Boolean isOnline, Integer maxPlayers, Double score, String reason) {
        this.id = id;
        this.name = name;
        this.game = game;
        this.description = description;
        this.priceClient = priceClient;
        this.startAt = startAt;
        this.endAt = endAt;
        this.isOnline = isOnline;
        this.maxPlayers = maxPlayers;
        this.score = score;
        this.reason = reason;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGame() { return game; }
    public void setGame(String game) { this.game = game; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPriceClient() { return priceClient; }
    public void setPriceClient(BigDecimal priceClient) { this.priceClient = priceClient; }

    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public Boolean getIsOnline() { return isOnline; }
    public void setIsOnline(Boolean isOnline) { this.isOnline = isOnline; }

    public Integer getMaxPlayers() { return maxPlayers; }
    public void setMaxPlayers(Integer maxPlayers) { this.maxPlayers = maxPlayers; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
