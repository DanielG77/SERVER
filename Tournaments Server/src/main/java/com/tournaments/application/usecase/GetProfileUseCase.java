package com.tournaments.application.usecase;

import com.tournaments.application.dto.ProfileDto;
import com.tournaments.application.mapper.ProfileMapper;
import com.tournaments.domain.model.Profile;
import com.tournaments.domain.model.User;
import com.tournaments.domain.service.FollowService;
import com.tournaments.domain.service.ProfileService;
import com.tournaments.domain.service.UserService;

public class GetProfileUseCase {

    private final ProfileService profileService;
    private final UserService userService;
    private final FollowService followService;
    private final ProfileMapper profileMapper;

    public GetProfileUseCase(ProfileService profileService, UserService userService, FollowService followService, ProfileMapper profileMapper) {
        this.profileService = profileService;
        this.userService = userService;
        this.followService = followService;
        this.profileMapper = profileMapper;
    }

    public ProfileDto execute(String username, Long currentUserId) {
        User user = userService.getUserByUsername(username);
        Profile profile = profileService.getProfileByUserId(user.getId());

        ProfileDto dto = profileMapper.toDto(profile);
        dto.setUsername(user.getUsername());
        dto.setFollowing(currentUserId != null && followService.isFollowing(currentUserId, user.getId()));
        dto.setFollowersCount(followService.getFollowersCount(user.getId()));
        dto.setFollowingCount(followService.getFollowingCount(user.getId()));

        return dto;
    }
}