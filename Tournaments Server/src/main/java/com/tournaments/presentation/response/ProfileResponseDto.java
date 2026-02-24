package com.tournaments.presentation.response;

public class ProfileResponseDto {

    private Long id;
    private String username;
    private String bio;
    private String avatarUrl;
    private String createdAt;
    private String updatedAt;
    private boolean following;
    private long followersCount;
    private long followingCount;

    public ProfileResponseDto() {}

    public ProfileResponseDto(Long id, String username, String bio, String avatarUrl, String createdAt, String updatedAt, boolean following, long followersCount, long followingCount) {
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
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