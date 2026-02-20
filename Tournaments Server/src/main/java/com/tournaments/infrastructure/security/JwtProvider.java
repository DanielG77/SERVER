package com.tournaments.infrastructure.security;

import java.util.Set;

public interface JwtProvider {

    String generateToken(String username, String email, Set<String> roles);

    void invalidateToken(String token);
}
