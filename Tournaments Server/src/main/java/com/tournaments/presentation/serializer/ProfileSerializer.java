package com.tournaments.presentation.serializer;

import com.tournaments.application.dto.ProfileDto;
import com.tournaments.presentation.response.ProfileResponseDto;

public class ProfileSerializer {

    public static ProfileResponseDto serialize(ProfileDto profile) {
        return new ProfileResponseDto(
            profile.getId(),
            profile.getUsername(),
            profile.getBio(),
            profile.getAvatarUrl(),
            profile.getCreatedAt().toString(),
            profile.getUpdatedAt().toString(),
            profile.isFollowing(),
            profile.getFollowersCount(),
            profile.getFollowingCount()
        );
    }
}