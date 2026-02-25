package com.tournaments.domain.model;

import java.time.OffsetDateTime;

public class RefreshToken {

    private Long id;
    private String token;
    private Long userId;
    private OffsetDateTime expiryDate;
    private OffsetDateTime createdAt;
    private Boolean revoked;

    public RefreshToken() {}

    public RefreshToken(Long id, String token, Long userId, OffsetDateTime expiryDate, OffsetDateTime createdAt) {
        this.id = id;
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
        this.revoked = false;
    }

    public RefreshToken(Long id, String token, Long userId, OffsetDateTime expiryDate, OffsetDateTime createdAt, Boolean revoked) {
        this.id = id;
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
        this.revoked = revoked;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public OffsetDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(OffsetDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getRevoked() {
        return revoked;
    }

    public void setRevoked(Boolean revoked) {
        this.revoked = revoked;
    }
}