package com.tournaments.domain.repository;

import java.util.Optional;

import com.tournaments.domain.model.User;

public interface UserRepository {
    Optional<User> findById(Long id);
}
