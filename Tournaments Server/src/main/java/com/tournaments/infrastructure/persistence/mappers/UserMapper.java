package com.tournaments.infrastructure.persistence.mappers;

import java.util.stream.Collectors;

import com.tournaments.domain.model.User;
import com.tournaments.infrastructure.persistence.entities.UserEntity;

public class UserMapper {

    public static User toDomain(UserEntity entity) {
        if (entity == null) {
            return null;
        }
        return new User(
                entity.getId(),
                entity.getUsername(),
                entity.getEmail(),
                entity.getPassword(),
                entity.isEnabled(),
                entity.getCreatedAt(),
                entity.getRoles().stream().map(RoleMapper::toDomain).collect(Collectors.toSet())
        );
    }

    public static UserEntity toEntity(User domain) {
        if (domain == null) {
            return null;
        }
        UserEntity entity = new UserEntity();
        entity.setId(domain.getId());
        entity.setUsername(domain.getUsername());
        entity.setEmail(domain.getEmail());
        entity.setPassword(domain.getPassword());
        entity.setRoles(domain.getRoles().stream().map(RoleMapper::toEntity).collect(Collectors.toSet()));
        entity.setEnabled(domain.isEnabled());
        entity.setCreatedAt(domain.getCreatedAt());
        return entity;
    }
}
