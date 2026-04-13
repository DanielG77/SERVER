package com.tournaments.presentation.response;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response DTO para la cancelación de un torneo.
 * Incluye información sobre cuántos pagos fueron reembolsados y cuáles fallaron.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancelTournamentResponse {
    private UUID tournamentId;
    private String newStatus; // "CANCELLED"
    private int refundedCount;
    private List<FailedRefund> failedRefunds;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FailedRefund {
        private UUID paymentId;
        private String errorMessage;
    }
}
