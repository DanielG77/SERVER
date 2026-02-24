package com.tournaments.domain.service;

import com.tournaments.domain.model.User;

public interface UserService {

    User createUser(String username, String email, String password);

    User getUserById(Long id);

    User getUserByUsername(String username);

    User getUserByEmail(String email);

    User updateUser(Long id, String username, String email);

    void deleteUser(Long id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}