package com.tournaments.infrastructure.persistence.mappers;

import org.mapstruct.Mapper;

import com.tournaments.domain.model.Profile;
import com.tournaments.infrastructure.persistence.entities.ProfileEntity;

@Mapper(componentModel = "spring")
public interface ProfileEntityMapper {

    Profile toDomain(ProfileEntity entity);

    ProfileEntity toEntity(Profile domain);
}