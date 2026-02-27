package com.tournaments.application.service.impl;

import java.time.OffsetDateTime;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tournaments.domain.exception.InvalidCredentialsException;
import com.tournaments.domain.exception.ResourceNotFoundException;
import com.tournaments.domain.model.RefreshToken;
import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.JwtProviderPort;
import com.tournaments.domain.repository.PasswordEncoderPort;
import com.tournaments.domain.repository.RefreshTokenRepositoryPort;
import com.tournaments.domain.repository.UserRepositoryPort;
import com.tournaments.domain.service.AuthService;

public class AuthServiceImpl implements AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepositoryPort userRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final JwtProviderPort jwtProvider;
    private final RefreshTokenRepositoryPort refreshTokenRepository;

    public AuthServiceImpl(UserRepositoryPort userRepository, PasswordEncoderPort passwordEncoder, JwtProviderPort jwtProvider, RefreshTokenRepositoryPort refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }

   @Override
    public User authenticate(String usernameOrEmail, String password) {
        log.info("Intentando autenticar usuario: {}", usernameOrEmail);

        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials")));

        log.info("AUTH DEBUG -> userFound: id={}, username={}, email={}", 
                user.getId(), user.getUsername(), user.getEmail());
        log.info("AUTH DEBUG -> incomingPassword (raw): '{}'", password);
        log.info("AUTH DEBUG -> dbPasswordHash: '{}'", user.getPassword());

        boolean matches = passwordEncoder.matches(password, user.getPassword());
        log.info("AUTH DEBUG -> passwordEncoder.matches => {}", matches);

        if (!matches) {
            throw new InvalidCredentialsException("Invalid credentials para tus usuarios Daniel");
        }

        return user;
    }
    
   @Override
    public String generateJwtToken(User user) {
        String[] roles = user.getRoles().stream().map(role -> role.getName()).toArray(String[]::new);
        log.debug("Generando token para usuario: {} con roles: {}", user.getUsername(), Arrays.toString(roles));
        String token = jwtProvider.generateToken(user.getUsername(), roles);
        log.debug("Token generado (primeros 20 chars): {}...", token.substring(0, Math.min(20, token.length())));
        return token;
    }

    @Override
    public String generateRefreshToken(User user) {

        String token = java.util.UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(token);
        refreshToken.setUserId(user.getId());
        refreshToken.setExpiryDate(OffsetDateTime.now().plusDays(7));
        refreshToken.setCreatedAt(OffsetDateTime.now());

        refreshTokenRepository.save(refreshToken);

        return token;
    }

    @Override
    public User validateTokenAndGetUser(String token) {
        if (!jwtProvider.validateToken(token)) {
            throw new InvalidCredentialsException("Invalid token");
        }
        String username = jwtProvider.getSubjectFromToken(token);
        return userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public void invalidateRefreshToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> refreshTokenRepository.deleteByToken(rt.getToken()));
    }
}
