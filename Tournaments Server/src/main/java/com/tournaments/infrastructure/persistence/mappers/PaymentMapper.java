package com.tournaments.infrastructure.persistence.mappers;

import com.tournaments.domain.model.Payment;
import com.tournaments.infrastructure.persistence.entities.PaymentEntity;

public class PaymentMapper {

    public static Payment toDomain(PaymentEntity entity) {
        if (entity == null) {
            return null;
        }

        Long userId = entity.getReservation() != null && entity.getReservation().getUser() != null
                ? entity.getReservation().getUser().getId()
                : null;

        return Payment.builder()
                .id(entity.getId())
                .userId(userId)
                .reservationId(entity.getReservation() != null ? entity.getReservation().getId() : null)
                .stripePaymentIntentId(entity.getStripePaymentIntentId())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static PaymentEntity toEntity(Payment domain) {
        if (domain == null) {
            return null;
        }

        PaymentEntity entity = new PaymentEntity();
        entity.setId(domain.getId());
        entity.setStripePaymentIntentId(domain.getStripePaymentIntentId());
        entity.setAmount(domain.getAmount());
        entity.setCurrency(domain.getCurrency());
        entity.setStatus(domain.getStatus());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }
}