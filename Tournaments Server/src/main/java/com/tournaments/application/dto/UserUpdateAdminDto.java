package com.tournaments.application.dto;

import java.util.Set;

/**
 * DTO para actualizar un usuario desde el panel de administrador.
 * Incluye campos que solo admin puede modificar: email, roles, isActive.
 */
public class UserUpdateAdminDto {

    private String email;
    private Boolean isActive;
    private Set<String> roles; // nombres de roles: "ROLE_ADMIN", "ROLE_USER"

    public UserUpdateAdminDto() {}

    public UserUpdateAdminDto(String email, Boolean isActive, Set<String> roles) {
        this.email = email;
        this.isActive = isActive;
        this.roles = roles;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
