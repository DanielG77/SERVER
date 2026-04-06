package com.tournaments.infrastructure.persistence.mappers;

import com.tournaments.domain.model.Payment;
import com.tournaments.infrastructure.persistence.entities.PaymentEntity;

public class PaymentMapper {

    public static Payment toDomain(PaymentEntity entity) {
        if (entity == null) {
            return null;
        }
        return Payment.builder()
                .id(entity.getId())
                .reservationId(entity.getReservation().getId())
                .stripePaymentIntentId(entity.getStripePaymentIntentId())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static PaymentEntity toEntity(Payment domain) {
        if (domain == null) {
            return null;
        }
        PaymentEntity entity = new PaymentEntity();
        entity.setId(domain.getId());
        // Note: We don't set the reservation here, as it's managed by the relationship.
        // The reservation should be set on the entity before saving.
        entity.setStripePaymentIntentId(domain.getStripePaymentIntentId());
        entity.setAmount(domain.getAmount());
        entity.setCurrency(domain.getCurrency());
        entity.setStatus(domain.getStatus());
        entity.setCreatedAt(domain.getCreatedAt());
        return entity;
    }
}
