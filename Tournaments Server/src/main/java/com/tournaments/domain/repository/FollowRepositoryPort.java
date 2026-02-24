package com.tournaments.domain.repository;

import java.util.List;
import java.util.Optional;

import com.tournaments.domain.model.Follow;

public interface FollowRepositoryPort {

    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);

    Follow save(Follow follow);

    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

    List<Follow> findFollowersByUserId(Long userId);

    List<Follow> findFollowingByUserId(Long userId);

    long countFollowersByUserId(Long userId);

    long countFollowingByUserId(Long userId);
}