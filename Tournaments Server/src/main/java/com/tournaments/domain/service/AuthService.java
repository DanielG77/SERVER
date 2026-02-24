package com.tournaments.domain.service;

import com.tournaments.domain.model.User;

public interface AuthService {

    User authenticate(String usernameOrEmail, String password);

    String generateJwtToken(User user);

    String generateRefreshToken(User user);

    User validateTokenAndGetUser(String token);

    void invalidateRefreshToken(String token);
}