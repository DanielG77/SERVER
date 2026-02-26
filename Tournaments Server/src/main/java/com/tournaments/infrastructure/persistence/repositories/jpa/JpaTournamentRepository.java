package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

@Repository
public interface JpaTournamentRepository
        extends JpaRepository<TournamentEntity, UUID>, JpaSpecificationExecutor<TournamentEntity> {

    Optional<TournamentEntity> findBySlug(String slug);    

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    // === NUEVOS MÉTODOS PARA ADMIN Y USUARIO ===
    
    /**
     * Obtiene un torneo específico del usuario.
     * Usado por usuarios para verificar que el torneo les pertenece.
     */
    Optional<TournamentEntity> findByIdAndOwnerId(UUID id, Long userId);

    /**
     * Obtiene torneos activos de un usuario.
     * Usado por usuarios para listar sus torneos.
     */
    Page<TournamentEntity> findByOwnerIdAndIsActive(Long userId, Boolean isActive, Pageable pageable);

    /**
     * Obtiene todos los torneos de un usuario (activos e inactivos).
     * Usado por admin o para auditoría.
     */
    Page<TournamentEntity> findByOwnerId(Long userId, Pageable pageable);
}
