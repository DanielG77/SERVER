package com.tournaments.domain.model;

public class Platform {
    private final Long id;
    private final String name;
    private final String icon;

    public Platform(Long id, String name, String icon) {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getIcon() { return icon; }
}