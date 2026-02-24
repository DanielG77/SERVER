package com.tournaments.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tournaments.application.dto.ProfileDto;
import com.tournaments.domain.model.Profile;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    @Mapping(target = "username", ignore = true) // Will be set separately
    @Mapping(target = "following", ignore = true)
    @Mapping(target = "followersCount", ignore = true)
    @Mapping(target = "followingCount", ignore = true)
    ProfileDto toDto(Profile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "avatarUrl", expression = "java(\"https://i.pravatar.cc/150?u=\" + userId)")
    @Mapping(target = "createdAt", expression = "java(java.time.OffsetDateTime.now())")
    @Mapping(target = "updatedAt", expression = "java(java.time.OffsetDateTime.now())")
    Profile toEntity(Long userId, String bio);
}