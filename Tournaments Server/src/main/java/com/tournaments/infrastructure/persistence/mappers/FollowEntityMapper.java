package com.tournaments.infrastructure.persistence.mappers;

import org.mapstruct.Mapper;

import com.tournaments.domain.model.Follow;
import com.tournaments.infrastructure.persistence.entities.FollowEntity;

@Mapper(componentModel = "spring")
public interface FollowEntityMapper {

    Follow toDomain(FollowEntity entity);

    FollowEntity toEntity(Follow domain);
}