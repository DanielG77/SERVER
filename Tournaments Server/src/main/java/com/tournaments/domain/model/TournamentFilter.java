package com.tournaments.domain.model;

import java.time.LocalDateTime;
import java.util.List;

import com.tournaments.domain.enums.TournamentStatus;

public record TournamentFilter(
        TournamentStatus status,
        Boolean isActive,
        LocalDateTime startAtFrom,
        LocalDateTime startAtTo,
        String search,
        // Nuevos filtros para videojuegos
        Long gameId,
        List<Long> genreIds,
        List<Long> platformIds,
        Long formatId,
        Boolean isOnline,
        Integer minPlayers,
        Integer maxPlayers
) {
    // Constructor auxiliar que usa valores por defecto (null / listas vacías)
    public TournamentFilter(TournamentStatus status,
                            Boolean isActive,
                            LocalDateTime startAtFrom,
                            LocalDateTime startAtTo,
                            String search) {
        this(status,
             isActive,
             startAtFrom,
             startAtTo,
             search,
             null,           // gameId
             List.of(),      // genreIds
             List.of(),      // platformIds
             null,           // formatId
             null,           // isOnline
             null,           // minPlayers
             null);          // maxPlayers
    }
}
