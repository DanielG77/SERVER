package com.tournaments.domain.model;

import java.time.LocalDateTime;
import com.tournaments.domain.enums.TournamentStatus;

public record TournamentFilter(
        TournamentStatus status,
        Boolean isActive,
        LocalDateTime startDateFrom,
        LocalDateTime startDateTo,
        String search) {
}
