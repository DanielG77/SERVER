package com.tournaments.shared.exceptions;

import java.util.UUID;

public class TournamentNotFoundException extends RuntimeException {

    public TournamentNotFoundException(UUID id) {
        super("Tournament not found with id: " + id);
    }
}
