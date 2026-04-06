package com.tournaments.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.tournaments.domain.model.Payment;

public interface PaymentRepository {
    Payment save(Payment payment);
    Optional<Payment> findById(UUID id);
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
}
