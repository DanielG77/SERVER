package com.tournaments.domain.enums;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TournamentStatus {
    DRAFT("draft"),
    OPEN("open"),
    RUNNING("running"),
    COMPLETED("completed"),
    CANCELLED("cancelled");

    private final String value;
    private static final Map<String, TournamentStatus> LOOKUP_MAP = 
        Arrays.stream(TournamentStatus.values())
            .collect(Collectors.toMap(
                status -> status.value.toLowerCase(),
                status -> status
            ));

    TournamentStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static TournamentStatus fromString(String value) {
        if (value == null) {
            return null;
        }
        TournamentStatus status = LOOKUP_MAP.get(value.toLowerCase().trim());
        if (status == null) {
            throw new IllegalArgumentException(
                "Unknown tournament status: '" + value + 
                "'. Valid values: " + 
                Arrays.stream(TournamentStatus.values())
                    .map(TournamentStatus::getValue)
                    .collect(Collectors.joining(", "))
            );
        }
        return status;
    }
}