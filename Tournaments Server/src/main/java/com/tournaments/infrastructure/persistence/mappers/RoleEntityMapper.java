package com.tournaments.infrastructure.persistence.mappers;

import org.mapstruct.Mapper;

import com.tournaments.domain.model.Role;
import com.tournaments.infrastructure.persistence.entities.RoleEntity;

@Mapper(componentModel = "spring")
public interface RoleEntityMapper {

    Role toDomain(RoleEntity entity);

    RoleEntity toEntity(Role domain);
}