package com.tournaments.presentation.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateTournamentRequest {

    @NotBlank(message = "Tournament name is required")
    @Size(min = 3, max = 100, message = "Tournament name must be between 3 and 100 characters")
    @JsonProperty("name")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @JsonProperty("description")
    private String description;

    @JsonProperty("images")
    private List<String> images = List.of(); // JSON array por defecto

    @JsonProperty("status")
    @Pattern(regexp = "draft|open|running|completed|cancelled", message = "Status must be one of: draft, open, running, completed, cancelled")
    private String status = "draft";

    @DecimalMin(value = "0.00", message = "Client price must be greater than or equal to 0")
    @Digits(integer = 8, fraction = 2, message = "Client price must have up to 8 integer digits and 2 decimal digits")
    @JsonProperty("price_client")
    private BigDecimal priceClient;

    @DecimalMin(value = "0.00", message = "Player price must be greater than or equal to 0")
    @Digits(integer = 8, fraction = 2, message = "Player price must have up to 8 integer digits and 2 decimal digits")
    @JsonProperty("price_player")
    private BigDecimal pricePlayer;

    @JsonProperty("is_active")
    private boolean isActive = true;

    @JsonProperty("start_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startAt;

    @JsonProperty("end_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endAt;

    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with hyphen")
    @Size(min = 3, max = 50, message = "Slug must be between 3 and 50 characters")
    @JsonProperty("slug")
    private String slug;

    // ===== NUEVOS CAMPOS PARA VIDEOJUEGOS =====
    
    @NotNull(message = "Game ID is required")
    @JsonProperty("game_id")
    private Long gameId;
    
    @JsonProperty("format_id")
    private Long formatId;
    
    @JsonProperty("is_online")
    private Boolean isOnline = true;
    
    @Min(value = 1, message = "Minimum players must be at least 1")
    @JsonProperty("min_players")
    private Integer minPlayers = 1;
    
    @Min(value = 1, message = "Maximum players must be at least 1")
    @JsonProperty("max_players")
    private Integer maxPlayers;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @JsonProperty("capacity")
    private Integer capacity;

    // ===== GETTERS Y SETTERS EXISTENTES =====
    
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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

    // ===== GETTERS Y SETTERS NUEVOS =====
    
    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Long getFormatId() {
        return formatId;
    }

    public void setFormatId(Long formatId) {
        this.formatId = formatId;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}