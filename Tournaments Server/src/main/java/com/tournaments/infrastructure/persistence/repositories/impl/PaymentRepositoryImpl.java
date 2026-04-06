package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.Payment;
import com.tournaments.domain.repository.PaymentRepository;
import com.tournaments.infrastructure.persistence.entities.PaymentEntity;
import com.tournaments.infrastructure.persistence.entities.TicketReservationEntity;
import com.tournaments.infrastructure.persistence.mappers.PaymentMapper;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaPaymentRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTicketReservationRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PaymentRepositoryImpl implements PaymentRepository {

    private final JpaPaymentRepository jpaPaymentRepository;
    private final JpaTicketReservationRepository jpaTicketReservationRepository;

    @Override
    public Payment save(Payment domain) {
        // Cargar la reserva completa (con sus relaciones, incluyendo el usuario)
        TicketReservationEntity reservation = jpaTicketReservationRepository.findById(domain.getReservationId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada: " + domain.getReservationId()));

        // Construir la entidad JPA (sin asignar usuario directamente)
        PaymentEntity entity = PaymentEntity.builder()
                .reservation(reservation)
                .amount(domain.getAmount())
                .currency(domain.getCurrency())
                .status(domain.getStatus())
                .stripePaymentIntentId(domain.getStripePaymentIntentId())
                .build();

        // Guardar
        PaymentEntity savedEntity = jpaPaymentRepository.save(entity);

        // Mapear de vuelta a dominio (ahora extraerá userId de la reserva)
        return PaymentMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Payment> findById(UUID id) {
        return jpaPaymentRepository.findById(id).map(PaymentMapper::toDomain);
    }

    @Override
    public Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId) {
        return jpaPaymentRepository.findByStripePaymentIntentId(stripePaymentIntentId).map(PaymentMapper::toDomain);
    }
}