package com.tournaments.application.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.tournaments.application.dto.UserResponseDto;
import com.tournaments.application.dto.UserUpdateAdminDto;

/**
 * Servicio para operaciones de usuario disponibles solo para administradores.
 * Administradores pueden:
 * - Ver todos los usuarios (activos e inactivos)
 * - Actualizar perfiles de usuarios (email, roles, is_active)
 * - Eliminar usuarios (soft delete)
 */
public interface AdminUserService {

    /**
     * Obtiene todos los usuarios (activos e inactivos).
     */
    Page<UserResponseDto> getAllUsers(Pageable pageable);

    /**
     * Obtiene un usuario específico por ID.
     */
    UserResponseDto getUserById(Long id);

    /**
     * Actualiza un usuario (email, roles, is_active).
     */
    UserResponseDto updateUser(Long userId, UserUpdateAdminDto updateDto);

    /**
     * Realiza un soft delete del usuario (is_active = false).
     * El usuario puede ser reactivado después.
     */
    void softDeleteUser(Long userId);

    /**
     * Realiza un hard delete del usuario (eliminación física).
     * Úsalo con cuidado - esta acción es irreversible y puede causar
     * problemas de integridad referencial.
     */
    void hardDeleteUser(Long userId);
}
