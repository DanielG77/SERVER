package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

import jakarta.persistence.LockModeType;

@Repository
public interface JpaTournamentRepository
        extends JpaRepository<TournamentEntity, UUID>, JpaSpecificationExecutor<TournamentEntity> {

    Optional<TournamentEntity> findBySlug(String slug);    

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    // === NUEVOS MÉTODOS PARA ADMIN Y USUARIO ===
    
    Optional<TournamentEntity> findByIdAndOwnerId(UUID id, Long userId);
    Page<TournamentEntity> findByOwnerIdAndIsActive(Long userId, Boolean isActive, Pageable pageable);
    Page<TournamentEntity> findByOwnerId(Long userId, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TournamentEntity t WHERE t.id = :id")
    Optional<TournamentEntity> findByIdForUpdate(@Param("id") UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TournamentEntity t WHERE t.id = :tournamentId")
    Optional<TournamentEntity> findByIdWithLock(@Param("tournamentId") UUID tournamentId);

    // Métodos que usan String porque el campo status en la entidad es String
    List<TournamentEntity> findByStatus(String status, Pageable pageable);
    Integer countByStatus(String status);
}