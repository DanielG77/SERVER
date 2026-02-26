package com.tournaments.application.dto;

import java.time.OffsetDateTime;
import java.util.Set;

/**
 * DTO para responder con información del usuario.
 * Versión actualizada que incluye el campo isActive.
 */
public class UserResponseDto {

    private Long id;
    private String username;
    private String email;
    private Boolean enabled;
    private Boolean isActive; // nuevo campo
    private OffsetDateTime createdAt;
    private Set<String> roles;

    public UserResponseDto() {}

    public UserResponseDto(Long id, String username, String email, Boolean enabled, Boolean isActive,
                          OffsetDateTime createdAt, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.enabled = enabled;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.roles = roles;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
