package com.tournaments.infrastructure.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tournaments.infrastructure.persistence.entities.FollowEntity;

public interface JpaFollowRepository extends JpaRepository<FollowEntity, Long> {

    Optional<FollowEntity> findByFollowerIdAndFollowingId(Long followerId, Long followingId);

    @Query("SELECT f FROM FollowEntity f WHERE f.followingId = :userId")
    List<FollowEntity> findFollowersByUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM FollowEntity f WHERE f.followerId = :userId")
    List<FollowEntity> findFollowingByUserId(@Param("userId") Long userId);

    long countByFollowingId(Long userId);

    long countByFollowerId(Long userId);

    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
}