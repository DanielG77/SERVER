package com.tournaments.presentation.mapper;

import com.tournaments.domain.model.Payment;
import com.tournaments.presentation.dto.PaymentDTO;

public class PaymentMapper {

    public static PaymentDTO toDto(Payment domain) {
        if (domain == null) {
            return null;
        }
        return PaymentDTO.builder()
                .id(domain.getId())
                .reservationId(domain.getReservationId())
                .amount(domain.getAmount())
                .currency(domain.getCurrency())
                .status(domain.getStatus())
                .updatedAt(domain.getUpdatedAt())
                .clientSecret(domain.getClientSecret())
                .build();
    }
}
