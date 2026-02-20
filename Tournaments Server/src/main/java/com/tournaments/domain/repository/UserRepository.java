package com.tournaments.domain.repository;

import java.util.Optional;

import com.tournaments.domain.model.User;

public interface UserRepository {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    User save(User user);
}
