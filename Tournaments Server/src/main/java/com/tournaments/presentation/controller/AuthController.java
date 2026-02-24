package com.tournaments.presentation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.dto.AuthResponseDto;
import com.tournaments.application.dto.CreateUserDto;
import com.tournaments.application.dto.LoginRequestDto;
import com.tournaments.application.usecase.LoginUserUseCase;
import com.tournaments.application.usecase.RegisterUserUseCase;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;

    public AuthController(RegisterUserUseCase registerUserUseCase, LoginUserUseCase loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody CreateUserDto request) {
        AuthResponseDto response = registerUserUseCase.execute(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto request) {
        AuthResponseDto resp = loginUserUseCase.execute(request);
        return ResponseEntity.ok(resp);
    }
    

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        // authService.invalidateRefreshToken(token);  // elimina token de DB
        return ResponseEntity.ok().build();
    }

    // @PostMapping("/refresh")
    // public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
    //     String refreshToken = body.get("refreshToken");

    //     // 1. Verificar que el token existe y no expiró
    //     RefreshToken rt = refreshTokenRepository.findByToken(refreshToken)
    //         .orElseThrow(() -> new InvalidCredentialsException("Refresh token inválido"));

    //     if (rt.getExpiryDate().isBefore(OffsetDateTime.now())) {
    //         authService.invalidateRefreshToken(refreshToken);
    //         throw new InvalidCredentialsException("Refresh token expirado");
    //     }

    //     // 2. Generar nuevo access token
    //     User user = userRepository.findById(rt.getUserId())
    //         .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    //     String newAccessToken = authService.generateJwtToken(user);

    //     return ResponseEntity.ok(Map.of(
    //         "token", newAccessToken,
    //         "refreshToken", refreshToken  // opcional: podrías rotarlo y guardar uno nuevo
    //     ));
    // }
}
