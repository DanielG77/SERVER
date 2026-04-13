package com.tournaments.domain.exception;

/**
 * Excepción lanzada cuando se intenta acceder a un torneo que no existe.
 * Debe resultar en una respuesta HTTP 404 Not Found.
 */
public class TournamentNotFoundException extends RuntimeException {

    public TournamentNotFoundException(String message) {
        super(message);
    }

    public TournamentNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
