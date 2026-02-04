package com.tournaments.domain.model;

public enum TournamentStatus {
    DRAFT("draft"),
    OPEN("open"),
    RUNNING("running"),
    COMPLETED("completed"),
    CANCELLED("cancelled");

    private final String value;

    TournamentStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static TournamentStatus fromString(String value) {
        for (TournamentStatus status : TournamentStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown tournament status: " + value);
    }
}
