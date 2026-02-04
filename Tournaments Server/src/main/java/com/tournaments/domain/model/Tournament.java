package com.tournaments.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.tournaments.domain.enums.TournamentStatus;

public class Tournament {
    private final UUID id;
    private final String name;
    private final String description;
    private final List<String> images;
    private final TournamentStatus status; // Usa el enum
    private final BigDecimal priceClient;
    private final BigDecimal pricePlayer;
    private final boolean active;
    private final LocalDateTime createdAt;
    private final LocalDateTime startAt;
    private final LocalDateTime endAt;
    private final String slug;

    public Tournament(
            UUID id,
            String name,
            String description,
            List<String> images,
            TournamentStatus status, // Cambia de String a TournamentStatus
            BigDecimal priceClient,
            BigDecimal pricePlayer,
            boolean active,
            LocalDateTime createdAt,
            LocalDateTime startAt,
            LocalDateTime endAt,
            String slug) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.status = status;
        this.priceClient = priceClient;
        this.pricePlayer = pricePlayer;
        this.active = active;
        this.createdAt = createdAt;
        this.startAt = startAt;
        this.endAt = endAt;
        this.slug = slug;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getImages() {
        return images;
    }

    public TournamentStatus getStatus() {
        return status;
    } // Devuelve el enum

    public BigDecimal getPriceClient() {
        return priceClient;
    }

    public BigDecimal getPricePlayer() {
        return pricePlayer;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public String getSlug() {
        return slug;
    }
}