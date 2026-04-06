package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tournaments.infrastructure.persistence.entities.TicketReservationEntity;


@Repository
public interface JpaTicketReservationRepository extends JpaRepository<TicketReservationEntity, UUID> {
    List<TicketReservationEntity> findByUserId(Long userId);

    @Query("SELECT r FROM TicketReservationEntity r WHERE r.status = 'PENDING' AND r.expiresAt < :now")
    List<TicketReservationEntity> findPendingExpired(LocalDateTime now);
}
