package com.tournaments.application.service;

import com.tournaments.domain.model.Follow;
import com.tournaments.domain.repository.FollowRepositoryPort;
import com.tournaments.domain.service.FollowService;

public class FollowServiceImpl implements FollowService {

    private final FollowRepositoryPort followRepository;

    public FollowServiceImpl(FollowRepositoryPort followRepository) {
        this.followRepository = followRepository;
    }

    @Override
    public Follow followUser(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }
        if (isFollowing(followerId, followingId)) {
            throw new IllegalArgumentException("Already following");
        }
        Follow follow = new Follow();
        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);
        follow.setCreatedAt(java.time.OffsetDateTime.now());
        return followRepository.save(follow);
    }

    @Override
    public void unfollowUser(Long followerId, Long followingId) {
        followRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.findByFollowerIdAndFollowingId(followerId, followingId).isPresent();
    }

    @Override
    public long getFollowersCount(Long userId) {
        return followRepository.countFollowersByUserId(userId);
    }

    @Override
    public long getFollowingCount(Long userId) {
        return followRepository.countFollowingByUserId(userId);
    }
}