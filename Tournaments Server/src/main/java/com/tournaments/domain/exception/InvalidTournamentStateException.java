package com.tournaments.domain.exception;

/**
 * Excepción lanzada cuando se intenta una operación en un torneo
 * que se encuentra en un estado inválido para esa operación.
 * Debe resultar en una respuesta HTTP 409 Conflict.
 * Ejemplos: intentar cancelar un torneo ya completado, o reembolsar una reserva
 * en un torneo que no está OPENED.
 */
public class InvalidTournamentStateException extends RuntimeException {

    public InvalidTournamentStateException(String message) {
        super(message);
    }

    public InvalidTournamentStateException(String message, Throwable cause) {
        super(message, cause);
    }
}
