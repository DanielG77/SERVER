package com.tournaments.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para crear o actualizar un torneo.
 * Utilizado por administradores y usuarios normales.
 */
public class TournamentRequestDto {

    private String name;
    private String description;
    private List<String> images;
    private String status; // "draft", "open", "running", "completed", "cancelled"
    private BigDecimal priceClient;
    private BigDecimal pricePlayer;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Long gameId;
    private Long tournamentFormatId;
    private Boolean isOnline;
    private Integer minPlayers;
    private Integer maxPlayers;
    private List<Long> platformIds;

    public TournamentRequestDto() {}

    public TournamentRequestDto(String name, String description, List<String> images, String status,
                               BigDecimal priceClient, BigDecimal pricePlayer, LocalDateTime startAt,
                               LocalDateTime endAt, Long gameId, Long tournamentFormatId, Boolean isOnline,
                               Integer minPlayers, Integer maxPlayers, List<Long> platformIds) {
        this.name = name;
        this.description = description;
        this.images = images;
        this.status = status;
        this.priceClient = priceClient;
        this.pricePlayer = pricePlayer;
        this.startAt = startAt;
        this.endAt = endAt;
        this.gameId = gameId;
        this.tournamentFormatId = tournamentFormatId;
        this.isOnline = isOnline;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
        this.platformIds = platformIds;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getPriceClient() {
        return priceClient;
    }

    public void setPriceClient(BigDecimal priceClient) {
        this.priceClient = priceClient;
    }

    public BigDecimal getPricePlayer() {
        return pricePlayer;
    }

    public void setPricePlayer(BigDecimal pricePlayer) {
        this.pricePlayer = pricePlayer;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDateTime startAt) {
        this.startAt = startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
        this.endAt = endAt;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Long getTournamentFormatId() {
        return tournamentFormatId;
    }

    public void setTournamentFormatId(Long tournamentFormatId) {
        this.tournamentFormatId = tournamentFormatId;
    }

    public Boolean getIsOnline() {
        return isOnline;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }

    public Integer getMinPlayers() {
        return minPlayers;
    }

    public void setMinPlayers(Integer minPlayers) {
        this.minPlayers = minPlayers;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public List<Long> getPlatformIds() {
        return platformIds;
    }

    public void setPlatformIds(List<Long> platformIds) {
        this.platformIds = platformIds;
    }
}
