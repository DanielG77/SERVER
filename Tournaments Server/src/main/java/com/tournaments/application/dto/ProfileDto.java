package com.tournaments.application.dto;

import java.time.OffsetDateTime;

public class ProfileDto {

    private Long id;
    private String username;
    private String bio;
    private String avatarUrl;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private boolean following;
    private long followersCount;
    private long followingCount;

    public ProfileDto() {}

    public ProfileDto(Long id, String username, String bio, String avatarUrl, OffsetDateTime createdAt, OffsetDateTime updatedAt, boolean following, long followersCount, long followingCount) {
        this.id = id;
        this.username = username;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.following = following;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isFollowing() {
        return following;
    }

    public void setFollowing(boolean following) {
        this.following = following;
    }

    public long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(long followersCount) {
        this.followersCount = followersCount;
    }

    public long getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(long followingCount) {
        this.followingCount = followingCount;
    }
}