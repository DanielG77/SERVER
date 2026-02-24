package com.tournaments.domain.repository;

import java.util.Optional;

import com.tournaments.domain.model.Profile;

public interface ProfileRepositoryPort {

    Optional<Profile> findByUserId(Long userId);

    Optional<Profile> findByUsername(String username);

    Profile save(Profile profile);

    void deleteByUserId(Long userId);
}