package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tournaments.infrastructure.persistence.entities.PaymentEntity;

@Repository
public interface JpaPaymentRepository extends JpaRepository<PaymentEntity, UUID> {
    Optional<PaymentEntity> findByStripePaymentIntentId(String stripePaymentIntentId);
    List<PaymentEntity> findByReservationId(UUID reservationId);
}
