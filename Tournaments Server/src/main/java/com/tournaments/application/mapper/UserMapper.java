package com.tournaments.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tournaments.application.dto.CreateUserDto;
import com.tournaments.application.dto.UpdateUserDto;
import com.tournaments.application.dto.UserDto;
import com.tournaments.domain.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", expression = "java(user.getRoles().stream().map(role -> role.getName()).collect(java.util.stream.Collectors.toSet()))")
    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "enabled", constant = "true")
    @Mapping(target = "createdAt", expression = "java(java.time.OffsetDateTime.now())")
    @Mapping(target = "roles", ignore = true)
    User toEntity(CreateUserDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(UpdateUserDto dto);
}