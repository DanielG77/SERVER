package com.tournaments.presentation.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.dto.AuthResponseDto;
import com.tournaments.application.dto.CreateUserDto;
import com.tournaments.application.dto.LoginRequestDto;
import com.tournaments.application.service.RefreshTokenService;
import com.tournaments.application.usecase.LoginUserUseCase;
import com.tournaments.application.usecase.RegisterUserUseCase;
import com.tournaments.domain.exception.InvalidCredentialsException;
import com.tournaments.domain.exception.ResourceNotFoundException;
import com.tournaments.domain.model.RefreshToken;
import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.RefreshTokenRepositoryPort;
import com.tournaments.domain.repository.UserRepositoryPort;
import com.tournaments.domain.service.AuthService;
import com.tournaments.presentation.request.RefreshTokenRequest;
import com.tournaments.presentation.response.RefreshTokenResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final RefreshTokenService refreshTokenService;
    private final AuthService authService;
    private final RefreshTokenRepositoryPort refreshTokenRepository;
    private final UserRepositoryPort userRepository;

    public AuthController(RegisterUserUseCase registerUserUseCase, 
                        LoginUserUseCase loginUserUseCase,
                        RefreshTokenService refreshTokenService,
                        AuthService authService,
                        RefreshTokenRepositoryPort refreshTokenRepository,
                        UserRepositoryPort userRepository) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.refreshTokenService = refreshTokenService;
        this.authService = authService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
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

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Procesando refresh token request");
        
        String refreshTokenStr = request.getRefreshToken();
        
        // Buscar el refresh token en la base de datos
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
            .orElseThrow(() -> {
                log.warn("Refresh token no encontrado");
                return new InvalidCredentialsException("Refresh token inválido");
            });

        // Verificar que no esté revocado ni expirado
        refreshTokenService.verifyExpiration(refreshToken);

        // Obtener el usuario
        User user = userRepository.findById(refreshToken.getUserId())
            .orElseThrow(() -> {
                log.error("Usuario no encontrado para el refresh token");
                return new ResourceNotFoundException("Usuario no encontrado");
            });

        // Generar nuevo access token
        String newAccessToken = authService.generateJwtToken(user);
        
        // Generar nuevo refresh token (rotación) y revocar el anterior
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
        refreshTokenService.revokeToken(refreshTokenStr);

        log.info("Nuevo access token y refresh token generados exitosamente");
        
        return ResponseEntity.ok(new RefreshTokenResponse(newAccessToken, newRefreshToken.getToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Procesando logout request");
        
        try {
            String refreshToken = request.getRefreshToken();
            
            // Revocar el refresh token
            refreshTokenService.revokeToken(refreshToken);
            
            log.info("Logout exitoso");
            return ResponseEntity.ok().body("Logout successful");
        } catch (Exception e) {
            log.error("Error durante logout: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error during logout: " + e.getMessage());
        }
    }
}
