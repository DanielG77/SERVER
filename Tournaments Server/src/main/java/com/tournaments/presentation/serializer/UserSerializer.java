package com.tournaments.presentation.serializer;

import com.tournaments.application.dto.UserDto;
import com.tournaments.presentation.response.UserResponseDto;

public class UserSerializer {

    public static UserResponseDto serialize(UserDto user, Long requesterId) {
        String email = (requesterId != null && requesterId.equals(user.getId())) || user.getRoles().contains("ROLE_ADMIN") ? user.getEmail() : null;
        return new UserResponseDto(
            user.getId(),
            user.getUsername(),
            email,
            user.isEnabled(),
            user.getCreatedAt().toString(),
            user.getRoles()
        );
    }
}