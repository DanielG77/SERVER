package com.tournaments.application.dto;

import java.time.OffsetDateTime;
import java.util.Set;

public class UserDto {

    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private OffsetDateTime createdAt;
    private Set<String> roles;

    public UserDto() {}

    public UserDto(Long id, String username, String email, boolean enabled, OffsetDateTime createdAt, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.enabled = enabled;
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

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
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