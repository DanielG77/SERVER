package com.tournaments.infrastructure.persistence.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.tournaments.infrastructure.persistence.entities.UserEntity;

public interface JpaUserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // === NUEVOS MÉTODOS PARA ADMIN Y SEGURIDAD ===
    
    /**
     * Encuentra un usuario activo por ID.
     * Usado para login y operaciones de seguridad.
     */
    Optional<UserEntity> findByIdAndIsActive(Long id, Boolean isActive);

    /**
     * Encuentra un usuario activo por username.
     * Usado para login y búsquedas.
     */
    Optional<UserEntity> findByUsernameAndIsActive(String username, Boolean isActive);

    /**
     * Encuentra un usuario activo por email.
     * Usado para login y búsquedas.
     */
    Optional<UserEntity> findByEmailAndIsActive(String email, Boolean isActive);

    /**
     * Obtiene todos los usuarios (activos e inactivos).
     * Usado por admin para listar usuarios.
     */
    Page<UserEntity> findByIsActive(Boolean isActive, Pageable pageable);

    /**
     * Obtiene todos los usuarios independientemente del estado.
     */
    Page<UserEntity> findAll(Pageable pageable);
}