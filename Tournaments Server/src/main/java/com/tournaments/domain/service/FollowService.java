package com.tournaments.domain.service;

import com.tournaments.domain.model.Follow;

public interface FollowService {

    Follow followUser(Long followerId, Long followingId);

    void unfollowUser(Long followerId, Long followingId);

    boolean isFollowing(Long followerId, Long followingId);

    long getFollowersCount(Long userId);

    long getFollowingCount(Long userId);
}