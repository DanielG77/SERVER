package com.tournaments.domain.exception;

public class TicketReservationException extends RuntimeException{
    private final String code; // opcional, para diferenciar tipos de error

    public TicketReservationException(String message) {
        super(message);
        this.code = "GENERAL";
    }

    public TicketReservationException(String message, String code) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
