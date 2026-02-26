package com.tournaments.application.dto;

/**
 * DTO para crear o actualizar un juego.
 * Utilizado por administradores.
 */
public class GameRequestDto {

    private String name;
    private String description;
    private String iconUrl;
    private String releaseDate;

    public GameRequestDto() {}

    public GameRequestDto(String name, String description, String iconUrl, String releaseDate) {
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.releaseDate = releaseDate;
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

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }
}
