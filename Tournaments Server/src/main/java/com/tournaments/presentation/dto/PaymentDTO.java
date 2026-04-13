package com.tournaments.presentation.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentDTO {
    private UUID id;
    private UUID reservationId;
    private BigDecimal amount;
    private String currency;
    private String status;  // "succeeded", "refunded", etc.
    private LocalDateTime updatedAt;  // Timestamp da última atualización
    private String clientSecret; // This is the important part for the frontend
}
