package com.tournaments.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.dto.UpdateUserDto;
import com.tournaments.application.dto.UserDto;
import com.tournaments.application.usecase.GetUserByUsernameUseCase;
import com.tournaments.application.usecase.GetUserUseCase;
import com.tournaments.application.usecase.UpdateUserUseCase;
import com.tournaments.infrastructure.security.CustomUserDetails;
import com.tournaments.presentation.serializer.UserSerializer;

@RestController
@RequestMapping("/api/users")
public class CtrlUser {

    private final GetUserUseCase getUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final GetUserByUsernameUseCase getUserByUsernameUseCase;

    public CtrlUser(GetUserUseCase getUserUseCase, UpdateUserUseCase updateUserUseCase, GetUserByUsernameUseCase getUserByUsernameUseCase) {
        this.getUserUseCase = getUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.getUserByUsernameUseCase = getUserByUsernameUseCase;
    }

    // Endpoint para obtener el perfil del usuario autenticado
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || !(userDetails instanceof CustomUserDetails)) {
            return ResponseEntity.status(401).build();
        }
        
        Long userId = ((CustomUserDetails) userDetails).getId();
        UserDto user = getUserUseCase.execute(userId);
        return ResponseEntity.ok(UserSerializer.serialize(user, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id, 
                                    @AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = getUserUseCase.execute(id);
        
        Long requesterId = null;
        if (userDetails instanceof CustomUserDetails) {
            requesterId = ((CustomUserDetails) userDetails).getId();
        }
        
        return ResponseEntity.ok(UserSerializer.serialize(user, requesterId));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username, 
                                            @AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = getUserByUsernameUseCase.execute(username);
        
        Long requesterId = null;
        if (userDetails instanceof CustomUserDetails) {
            requesterId = ((CustomUserDetails) userDetails).getId();
        }
        
        return ResponseEntity.ok(UserSerializer.serialize(user, requesterId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, 
                                        @RequestBody UpdateUserDto dto, 
                                        @AuthenticationPrincipal UserDetails userDetails) {
        // Obtener requesterId de forma segura
        Long requesterId = null;
        if (userDetails instanceof CustomUserDetails) {
            requesterId = ((CustomUserDetails) userDetails).getId();
        }
        UserDto user = updateUserUseCase.execute(id, dto);
        return ResponseEntity.ok(UserSerializer.serialize(user, requesterId));
    }
}