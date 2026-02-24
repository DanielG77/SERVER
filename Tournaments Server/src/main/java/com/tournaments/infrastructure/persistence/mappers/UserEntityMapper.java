package com.tournaments.infrastructure.persistence.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tournaments.domain.model.User;
import com.tournaments.infrastructure.persistence.entities.UserEntity;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    @Mapping(target = "roles", expression = "java(entity.getRoles().stream().map(role -> new com.tournaments.domain.model.Role(role.getId(), role.getName(), role.getDescription())).collect(java.util.stream.Collectors.toSet()))")
    User toDomain(UserEntity entity);

    @Mapping(target = "roles", expression = "java(domain.getRoles().stream().map(role -> new com.tournaments.infrastructure.persistence.entities.RoleEntity(role.getId(), role.getName(), role.getDescription())).collect(java.util.stream.Collectors.toSet()))")
    UserEntity toEntity(User domain);
}