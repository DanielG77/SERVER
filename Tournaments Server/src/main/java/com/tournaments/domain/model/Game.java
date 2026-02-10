package com.tournaments.domain.model;

import java.time.LocalDate;
import java.util.List;

public class Game {
    private final Long id;
    private final String name;
    private final String description;
    private final String iconUrl;
    private final LocalDate releaseDate;
    private final List<Genre> genres;

    public Game(
            Long id,
            String name,
            String description,
            String iconUrl,
            LocalDate releaseDate,
            List<Genre> genres) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.releaseDate = releaseDate;
        this.genres = genres;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getIconUrl() { return iconUrl; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public List<Genre> getGenres() { return genres; }
}