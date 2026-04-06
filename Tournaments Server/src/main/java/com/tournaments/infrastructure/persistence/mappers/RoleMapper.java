package com.tournaments.infrastructure.persistence.mappers;

import com.tournaments.domain.model.Role;
import com.tournaments.infrastructure.persistence.entities.RoleEntity;

public class RoleMapper {

    public static Role toDomain(RoleEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Role(
            entity.getId(),
            entity.getName(),
            entity.getDescription()  // agregar descripción
        );
    }

    public static RoleEntity toEntity(Role domain) {
        if (domain == null) {
            return null;
        }
        RoleEntity entity = new RoleEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());  // agregar descripción
        return entity;
    }
}
