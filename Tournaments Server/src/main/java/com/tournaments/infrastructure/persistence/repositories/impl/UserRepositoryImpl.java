package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.UserRepository;
import com.tournaments.infrastructure.persistence.mappers.UserMapper;
import com.tournaments.infrastructure.persistence.repositories.JpaUserRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final JpaUserRepository jpaUserRepository;

    @Override
    public Optional<User> findById(Long id) {
        return jpaUserRepository.findById(id).map(UserMapper::toDomain);
    }
}