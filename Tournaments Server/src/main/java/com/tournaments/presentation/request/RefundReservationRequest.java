package com.tournaments.presentation.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request DTO para reembolsar una reserva individual.
 * Por ahora es vacío, pero puede extenderse con un campo opcional de razón.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefundReservationRequest {
    private String reason; // Optional reason for refund
}
