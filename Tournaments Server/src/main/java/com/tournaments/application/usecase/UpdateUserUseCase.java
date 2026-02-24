package com.tournaments.application.usecase;

import com.tournaments.application.dto.UpdateUserDto;
import com.tournaments.application.dto.UserDto;
import com.tournaments.application.mapper.UserMapper;
import com.tournaments.domain.model.User;
import com.tournaments.domain.service.UserService;

public class UpdateUserUseCase {

    private final UserService userService;
    private final UserMapper userMapper;

    public UpdateUserUseCase(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    public UserDto execute(Long id, UpdateUserDto dto) {
        User updatedUser = userService.updateUser(id, dto.getUsername(), dto.getEmail());
        return userMapper.toDto(updatedUser);
    }
}