package com.tournaments.presentation.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.dto.UserResponseDto;
import com.tournaments.application.dto.UserUpdateAdminDto;
import com.tournaments.application.service.AdminUserService;
import com.tournaments.presentation.response.ApiResponse;

/**
 * Controlador REST para operaciones administrativas de usuarios.
 * Solo administradores pueden acceder a estos endpoints.
 * Ruta: /api/admin/users
 */
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponseDto> users = adminUserService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users, "Usuarios obtenidos"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable Long id) {
        UserResponseDto user = adminUserService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user, "Usuario obtenido"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateAdminDto updateDto) {

        UserResponseDto updated = adminUserService.updateUser(id, updateDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Usuario actualizado exitosamente"));
    }

    /**
     * DELETE /api/admin/users/{id}?hardDelete=true
     * Método unificado para soft/hard delete.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean hardDelete) {

        if (hardDelete) {
            adminUserService.hardDeleteUser(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Usuario eliminado permanentemente"));
        } else {
            adminUserService.softDeleteUser(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Usuario desactivado"));
        }
    }
}
