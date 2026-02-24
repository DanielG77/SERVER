package com.tournaments.infrastructure.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.tournaments.application.service.FollowServiceImpl;
import com.tournaments.application.service.ProfileServiceImpl;
import com.tournaments.application.service.UserServiceImpl;
import com.tournaments.application.service.impl.AuthServiceImpl;
import com.tournaments.application.usecase.FollowProfileUseCase;
import com.tournaments.application.usecase.GetProfileUseCase;
import com.tournaments.application.usecase.GetUserUseCase;
import com.tournaments.application.usecase.LoginUserUseCase;
import com.tournaments.application.usecase.RegisterUserUseCase;
import com.tournaments.application.usecase.UnfollowProfileUseCase;
import com.tournaments.application.usecase.UpdateUserUseCase;
import com.tournaments.domain.repository.FollowRepositoryPort;
import com.tournaments.domain.repository.JwtProviderPort;
import com.tournaments.domain.repository.PasswordEncoderPort;
import com.tournaments.domain.repository.ProfileRepositoryPort;
import com.tournaments.domain.repository.RefreshTokenRepositoryPort;
import com.tournaments.domain.repository.RoleRepositoryPort;
import com.tournaments.domain.repository.UserRepositoryPort;
import com.tournaments.domain.service.AuthService;
import com.tournaments.domain.service.FollowService;
import com.tournaments.domain.service.ProfileService;
import com.tournaments.domain.service.UserService;

@Configuration
public class ApplicationConfig {

    @Bean
    public UserService userService(
            @Qualifier("userRepositoryJpaAdapter") UserRepositoryPort userRepository,
            RoleRepositoryPort roleRepository,
            PasswordEncoderPort passwordEncoder) {
        return new UserServiceImpl(userRepository, roleRepository, passwordEncoder);
    }

    @Bean
    public ProfileService profileService(ProfileRepositoryPort profileRepository) {
        return new ProfileServiceImpl(profileRepository);
    }

    @Bean
    public FollowService followService(FollowRepositoryPort followRepository) {
        return new FollowServiceImpl(followRepository);
    }

    @Bean
    public AuthService authService(
            @Qualifier("userRepositoryJpaAdapter") UserRepositoryPort userRepository,
            PasswordEncoderPort passwordEncoder,
            JwtProviderPort jwtProvider,
            RefreshTokenRepositoryPort refreshTokenRepository) {
        return new AuthServiceImpl(userRepository, passwordEncoder, jwtProvider, refreshTokenRepository);
    }

    @Bean
    public RegisterUserUseCase registerUserUseCase(UserService userService, ProfileService profileService, AuthService authService) {
        return new RegisterUserUseCase(userService, profileService, authService);
    }

    @Bean
    public LoginUserUseCase loginUserUseCase(AuthService authService) {
        return new LoginUserUseCase(authService);
    }

    @Bean
    public GetUserUseCase getUserUseCase(UserService userService, com.tournaments.application.mapper.UserMapper userMapper) {
        return new GetUserUseCase(userService, userMapper);
    }

    @Bean
    public UpdateUserUseCase updateUserUseCase(UserService userService, com.tournaments.application.mapper.UserMapper userMapper) {
        return new UpdateUserUseCase(userService, userMapper);
    }

    @Bean
    public GetProfileUseCase getProfileUseCase(ProfileService profileService, UserService userService, FollowService followService, com.tournaments.application.mapper.ProfileMapper profileMapper) {
        return new GetProfileUseCase(profileService, userService, followService, profileMapper);
    }

    @Bean
    public FollowProfileUseCase followProfileUseCase(FollowService followService, UserService userService) {
        return new FollowProfileUseCase(followService, userService);
    }

    @Bean
    public UnfollowProfileUseCase unfollowProfileUseCase(FollowService followService, UserService userService) {
        return new UnfollowProfileUseCase(followService, userService);
    }
}