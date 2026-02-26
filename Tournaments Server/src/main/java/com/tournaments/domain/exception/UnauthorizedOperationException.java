package com.tournaments.domain.exception;

/**
 * Excepción lanzada cuando un usuario intenta realizar una operación
 * que no está autorizado a hacer (ej: actualizar un torneo que no le pertenece).
 * Debe resultar en una respuesta HTTP 403 Forbidden.
 */
public class UnauthorizedOperationException extends RuntimeException {

    public UnauthorizedOperationException(String message) {
        super(message);
    }

    public UnauthorizedOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}
