package com.tournaments.infrastructure.persistence.repositories.jpa;

import com.tournaments.infrastructure.persistence.entities.PaymentEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaPaymentRepository extends JpaRepository<PaymentEntity, UUID> {
    Optional<PaymentEntity> findByStripePaymentIntentId(String stripePaymentIntentId);
}
