package com.tournaments.presentation.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;

public class TournamentSearchRequest {
    @NotBlank(message = "Query cannot be blank")
    @JsonProperty("query")
    private String query;

    public TournamentSearchRequest() {}

    public TournamentSearchRequest(String query) {
        this.query = query;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
