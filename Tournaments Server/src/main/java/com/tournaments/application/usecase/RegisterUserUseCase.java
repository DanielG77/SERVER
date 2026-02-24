package com.tournaments.application.usecase;

import com.tournaments.application.dto.AuthResponseDto;
import com.tournaments.application.dto.CreateUserDto;
import com.tournaments.domain.model.User;
import com.tournaments.domain.service.AuthService;
import com.tournaments.domain.service.ProfileService;
import com.tournaments.domain.service.UserService;

public class RegisterUserUseCase {

    private final UserService userService;
    private final ProfileService profileService;
    private final AuthService authService;

    public RegisterUserUseCase(UserService userService, ProfileService profileService, AuthService authService) {
        this.userService = userService;
        this.profileService = profileService;
        this.authService = authService;
    }

    public AuthResponseDto execute(CreateUserDto dto) {
        // Create user
        User user = userService.createUser(dto.getUsername(), dto.getEmail(), dto.getPassword());

        // Create profile
        profileService.createProfile(user.getId(), null);

        // Generate tokens
        String token = authService.generateJwtToken(user);
        String refreshToken = authService.generateRefreshToken(user);

        return new AuthResponseDto(token, refreshToken, user.getUsername(), user.getEmail(),
            user.getRoles().stream().map(role -> role.getName()).collect(java.util.stream.Collectors.toSet()));
    }
}