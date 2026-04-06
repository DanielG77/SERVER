package com.tournaments.presentation.dto;

import com.tournaments.domain.enums.ReservationStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TicketReservationDTO {
    private UUID id;
    private UUID tournamentId;
    private Long userId;
    private ReservationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    // Nuevos campos para el frontend
    private String tournamentName;   // nombre del torneo
    private BigDecimal amount;       // monto a pagar
    private String currency;         // moneda (ej: "usd")
}