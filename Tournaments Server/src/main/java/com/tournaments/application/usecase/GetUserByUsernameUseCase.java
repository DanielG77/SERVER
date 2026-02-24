package com.tournaments.application.usecase;

import org.springframework.stereotype.Service;

import com.tournaments.application.dto.UserDto;
import com.tournaments.application.mapper.UserMapper;
import com.tournaments.domain.model.User;
import com.tournaments.domain.service.UserService;

@Service
public class GetUserByUsernameUseCase {

    private final UserService userService;
    private final UserMapper userMapper;

    public GetUserByUsernameUseCase(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    public UserDto execute(String username) {
        User user = userService.getUserByUsername(username);
        return userMapper.toDto(user);
    }
}