package com.tournaments.application.service.impl;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.service.AuthService;
import com.tournaments.domain.model.Role;
import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.RoleRepository;
import com.tournaments.domain.repository.UserRepository;
import com.tournaments.infrastructure.security.JwtProvider;
import com.tournaments.presentation.request.AuthResponse;
import com.tournaments.presentation.request.LoginRequest;
import com.tournaments.presentation.request.RegisterRequest;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    // =========================
    // REGISTER
    // =========================
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validaciones de existencia
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Obtener rol por defecto
        Role clientRole = roleRepository
                .findByName("ROLE_CLIENT")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        // Crear y guardar usuario
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.setCreatedAt(OffsetDateTime.now());
        user.setRoles(Set.of(clientRole));
        userRepository.save(user);

        // Generar token y construir respuesta
        Set<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String token = jwtProvider.generateToken(
                user.getUsername(),
                user.getEmail(),
                roles
        );

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                roles
        );
    }

    // =========================
    // LOGIN
    // =========================
    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("User disabled");
        }

        Set<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String token = jwtProvider.generateToken(
                user.getUsername(),
                user.getEmail(),
                roles
        );

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                roles
        );
    }

    // =========================
    // LOGOUT
    // =========================
    @Override
    public void logout(String bearerToken) {

        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return;
        }

        String token = bearerToken.substring(7);

        // Si implementas blacklist o refresh tokens
        jwtProvider.invalidateToken(token);
    }
}
