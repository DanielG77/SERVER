package com.tournaments.presentation.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response DTO para el reembolso de una reserva individual.
 * Incluye información sobre el reembolso realizado o error, si la hubo.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundReservationResponse {
    private UUID tournamentId;
    private UUID reservationId;
    private UUID paymentId;
    private String newReservationStatus; // "REFUNDED"
    private boolean refunded; // true si el reembolso fue exitoso
    private String errorMessage; // null si exitoso, mensaje de error en caso contrario
}
