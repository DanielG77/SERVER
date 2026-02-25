package com.tournaments.application.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.tournaments.domain.exception.InvalidCredentialsException;
import com.tournaments.domain.model.RefreshToken;
import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.RefreshTokenRepositoryPort;

@Service
public class RefreshTokenService {
    
    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);
    
    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpiration; // milliseconds
    
    private final RefreshTokenRepositoryPort refreshTokenRepository;
    
    public RefreshTokenService(RefreshTokenRepositoryPort refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    
    /**
     * Crea un nuevo refresh token para un usuario
     */
    public RefreshToken createRefreshToken(User user) {
        log.info("Creando refresh token para usuario: {}", user.getId());

        // Revocar todos los tokens activos anteriores del usuario
        revokeAllUserTokens(user);   // ← Línea clave

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUserId(user.getId());
        refreshToken.setCreatedAt(OffsetDateTime.now());
        refreshToken.setExpiryDate(OffsetDateTime.now().plusSeconds(refreshTokenExpiration / 1000));
        refreshToken.setRevoked(false);

        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        log.info("Refresh token creado exitosamente con ID: {}", saved.getId());
        return saved;
    }
    
    /**
     * Verifica que el refresh token no esté revocado ni expirado
     */
    public RefreshToken verifyExpiration(RefreshToken token) throws InvalidCredentialsException {
        log.debug("Verificando refresh token: {}", token.getToken().substring(0, Math.min(20, token.getToken().length())));
        
        if (token.getRevoked()) {
            log.warn("Token revocado encontrado: {}", token.getId());
            throw new InvalidCredentialsException("Refresh token ha sido revocado");
        }
        
        if (token.getExpiryDate().isBefore(OffsetDateTime.now())) {
            log.warn("Token expirado encontrado: {}", token.getId());
            revokeToken(token.getToken());
            throw new InvalidCredentialsException("Refresh token ha expirado");
        }
        
        log.debug("Token válido");
        return token;
    }
    
    /**
     * Revoca un refresh token específico (lo marca como revocado)
     */
    public void revokeToken(String token) {
        log.info("Revocando refresh token");
        
        refreshTokenRepository.findByToken(token).ifPresent(refreshToken -> {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            log.info("Refresh token revocado exitosamente");
        });
    }
    
    /**
     * Revoca todos los refresh tokens de un usuario
     */
    public void revokeAllUserTokens(User user) {
        log.info("Revocando todos los refresh tokens del usuario: {}", user.getId());
        
        var userTokens = refreshTokenRepository.findByUserId(user.getId());
        log.info("Tokens encontrados para revocar: {}", userTokens.size()); // ← NUEVO
        
        userTokens.forEach(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            log.debug("Token ID {} revocado", token.getId()); // ← OPCIONAL
        });
        
        log.info("Todos los refresh tokens del usuario han sido revocados");
    }
}
