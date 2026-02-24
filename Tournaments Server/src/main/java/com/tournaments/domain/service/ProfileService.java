package com.tournaments.domain.service;

import com.tournaments.domain.model.Profile;

public interface ProfileService {

    Profile createProfile(Long userId, String bio);

    Profile getProfileByUserId(Long userId);

    Profile getProfileByUsername(String username);

    Profile updateProfile(Long userId, String bio);

    void deleteProfile(Long userId);
}