package com.tournaments.infrastructure.persistence.mappers;

import org.mapstruct.Mapper;

import com.tournaments.domain.model.RefreshToken;
import com.tournaments.infrastructure.persistence.entities.RefreshTokenEntity;

@Mapper(componentModel = "spring")
public interface RefreshTokenEntityMapper {

    RefreshToken toDomain(RefreshTokenEntity entity);

    RefreshTokenEntity toEntity(RefreshToken domain);
}