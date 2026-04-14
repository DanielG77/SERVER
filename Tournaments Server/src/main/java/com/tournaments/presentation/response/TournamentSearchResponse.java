package com.tournaments.presentation.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TournamentSearchResponse {
    @JsonProperty("query")
    private String query;

    @JsonProperty("results")
    private List<TournamentSearchResultResponse> results;

    @JsonProperty("total")
    private Integer total;

    public TournamentSearchResponse() {}

    public TournamentSearchResponse(String query, List<TournamentSearchResultResponse> results) {
        this.query = query;
        this.results = results;
        this.total = results != null ? results.size() : 0;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public List<TournamentSearchResultResponse> getResults() { return results; }
    public void setResults(List<TournamentSearchResultResponse> results) { this.results = results; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
}
