package com.tournaments.application.usecase;

import com.tournaments.application.dto.UserDto;
import com.tournaments.application.mapper.UserMapper;
import com.tournaments.domain.model.User;
import com.tournaments.domain.service.UserService;

public class GetUserUseCase {

    private final UserService userService;
    private final UserMapper userMapper;

    public GetUserUseCase(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    public UserDto execute(Long id) {
        User user = userService.getUserById(id);
        return userMapper.toDto(user);
    }

    
}