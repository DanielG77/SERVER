package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.UserRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaUserRepository;

@Component
public class UserRepositoryImpl implements UserRepository {

    private final JpaUserRepository jpaUserRepository;

    public UserRepositoryImpl(JpaUserRepository jpaUserRepository) {
        this.jpaUserRepository = jpaUserRepository;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaUserRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email);
    }

    @Override
    public User save(User user) {
        return jpaUserRepository.save(user);
    }
}
