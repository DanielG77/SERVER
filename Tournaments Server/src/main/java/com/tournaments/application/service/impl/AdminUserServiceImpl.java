package com.tournaments.application.service.impl;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.dto.UserResponseDto;
import com.tournaments.application.dto.UserUpdateAdminDto;
import com.tournaments.application.service.AdminUserService;
import com.tournaments.domain.exception.ResourceNotFoundException;
import com.tournaments.infrastructure.persistence.entities.RoleEntity;
import com.tournaments.infrastructure.persistence.entities.UserEntity;
import com.tournaments.infrastructure.persistence.repositories.JpaRoleRepository;
import com.tournaments.infrastructure.persistence.repositories.JpaUserRepository;

/**
 * Implementación del servicio de usuarios para administradores.
 */
@Service
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final JpaUserRepository userRepository;
    private final JpaRoleRepository roleRepository;

    public AdminUserServiceImpl(JpaUserRepository userRepository, JpaRoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public Page<UserResponseDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    @Override
    public UserResponseDto getUserById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return mapToDto(user);
    }

    @Override
    public UserResponseDto updateUser(Long userId, UserUpdateAdminDto updateDto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + userId));

        // Actualizar email
        if (updateDto.getEmail() != null && !updateDto.getEmail().isBlank()) {
            user.setEmail(updateDto.getEmail());
        }

        // Actualizar is_active
        if (updateDto.getIsActive() != null) {
            user.setIsActive(updateDto.getIsActive());
        }

        // Actualizar roles
        if (updateDto.getRoles() != null && !updateDto.getRoles().isEmpty()) {
            Set<RoleEntity> roles = updateDto.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Rol no encontrado: " + roleName)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        UserEntity updated = userRepository.save(user);
        return mapToDto(updated);
    }

    @Override
    public void softDeleteUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + userId));
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    public void hardDeleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Usuario no encontrado con ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    private UserResponseDto mapToDto(UserEntity entity) {
        Set<String> roleNames = entity.getRoles().stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toSet());

        return new UserResponseDto(
                entity.getId(),
                entity.getUsername(),
                entity.getEmail(),
                entity.isEnabled(),
                entity.getIsActive(),
                entity.getCreatedAt(),
                roleNames);
    }
}
