package com.tournaments.domain.repository;

import java.util.Optional;

import com.tournaments.domain.model.User;

public interface UserRepositoryPort {
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    User save(User user);
    void deleteById(Long id);
    boolean existsById(Long id);
}
