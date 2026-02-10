package com.tournaments.domain.model;

public class TournamentFormat {
    private final Long id;
    private final String name;
    private final String description;
    private final Integer minPlayers;
    private final Integer maxPlayers;

    public TournamentFormat(
            Long id,
            String name,
            String description,
            Integer minPlayers,
            Integer maxPlayers) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Integer getMinPlayers() { return minPlayers; }
    public Integer getMaxPlayers() { return maxPlayers; }
}