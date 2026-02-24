package com.tournaments.application.service;

import com.tournaments.domain.exception.ResourceNotFoundException;
import com.tournaments.domain.model.Profile;
import com.tournaments.domain.repository.ProfileRepositoryPort;
import com.tournaments.domain.service.ProfileService;

public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepositoryPort profileRepository;

    public ProfileServiceImpl(ProfileRepositoryPort profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public Profile createProfile(Long userId, String bio) {
        Profile profile = new Profile();
        profile.setUserId(userId);
        profile.setBio(bio);
        profile.setAvatarUrl("https://i.pravatar.cc/150?u=" + userId);
        profile.setCreatedAt(java.time.OffsetDateTime.now());
        profile.setUpdatedAt(java.time.OffsetDateTime.now());
        return profileRepository.save(profile);
    }

    @Override
    public Profile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    }

    @Override
    public Profile getProfileByUsername(String username) {
        return profileRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    }

    @Override
    public Profile updateProfile(Long userId, String bio) {
        Profile profile = getProfileByUserId(userId);
        profile.setBio(bio);
        profile.setUpdatedAt(java.time.OffsetDateTime.now());
        return profileRepository.save(profile);
    }

    @Override
    public void deleteProfile(Long userId) {
        profileRepository.deleteByUserId(userId);
    }
}