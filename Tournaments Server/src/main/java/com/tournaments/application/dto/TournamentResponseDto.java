package com.tournaments.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO para responder con información de un torneo.
 * Incluye información del propietario y todas las relaciones.
 */
public class TournamentResponseDto {

    private UUID id;
    private String name;
    private String description;
    private List<String> images;
    private String status;
    private BigDecimal priceClient;
    private BigDecimal pricePlayer;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String slug;
    private Long userId; // propietario del torneo
    private String ownerUsername; // nombre del propietario
    private Long gameId;
    private String gameName; // nombre del juego
    private Long tournamentFormatId;
    private String tournamentFormatName;
    private Boolean isOnline;
    private Integer minPlayers;
    private Integer maxPlayers;
    private List<Long> platformIds;

    public TournamentResponseDto() {}

    public TournamentResponseDto(UUID id, String name, String description, List<String> images,
                                String status, BigDecimal priceClient, BigDecimal pricePlayer,
                                Boolean isActive, LocalDateTime createdAt, LocalDateTime startAt,
                                LocalDateTime endAt, String slug, Long userId, String ownerUsername,
                                Long gameId, String gameName, Long tournamentFormatId,
                                String tournamentFormatName, Boolean isOnline, Integer minPlayers,
                                Integer maxPlayers, List<Long> platformIds) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.status = status;
        this.priceClient = priceClient;
        this.pricePlayer = pricePlayer;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.startAt = startAt;
        this.endAt = endAt;
        this.slug = slug;
        this.userId = userId;
        this.ownerUsername = ownerUsername;
        this.gameId = gameId;
        this.gameName = gameName;
        this.tournamentFormatId = tournamentFormatId;
        this.tournamentFormatName = tournamentFormatName;
        this.isOnline = isOnline;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
        this.platformIds = platformIds;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public Long getTournamentFormatId() {
        return tournamentFormatId;
    }

    public void setTournamentFormatId(Long tournamentFormatId) {
        this.tournamentFormatId = tournamentFormatId;
    }

    public String getTournamentFormatName() {
        return tournamentFormatName;
    }

    public void setTournamentFormatName(String tournamentFormatName) {
        this.tournamentFormatName = tournamentFormatName;
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
