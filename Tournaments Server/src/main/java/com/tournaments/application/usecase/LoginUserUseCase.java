package com.tournaments.application.usecase;

import com.tournaments.application.dto.AuthResponseDto;
import com.tournaments.application.dto.LoginRequestDto;
import com.tournaments.domain.model.User;
import com.tournaments.domain.service.AuthService;

public class LoginUserUseCase {

    private final AuthService authService;

    public LoginUserUseCase(AuthService authService) {
        this.authService = authService;
    }

    public AuthResponseDto execute(LoginRequestDto dto) {
        User user = authService.authenticate(dto.getUsernameOrEmail(), dto.getPassword());

        String token = authService.generateJwtToken(user);
        String refreshToken = authService.generateRefreshToken(user);

        return new AuthResponseDto(token, refreshToken, user.getUsername(), user.getEmail(),
            user.getRoles().stream().map(role -> role.getName()).collect(java.util.stream.Collectors.toSet()));
    }
}