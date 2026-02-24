package com.tournaments.application.usecase;

import com.tournaments.domain.model.User;
import com.tournaments.domain.service.FollowService;
import com.tournaments.domain.service.UserService;

public class FollowProfileUseCase {

    private final FollowService followService;
    private final UserService userService;

    public FollowProfileUseCase(FollowService followService, UserService userService) {
        this.followService = followService;
        this.userService = userService;
    }

    public void execute(String username, Long currentUserId) {
        userService.getUserByUsername(username); // Check exists
        User targetUser = userService.getUserByUsername(username);
        followService.followUser(currentUserId, targetUser.getId());
    }
}