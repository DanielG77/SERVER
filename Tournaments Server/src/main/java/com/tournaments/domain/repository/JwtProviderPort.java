package com.tournaments.domain.repository;

public interface JwtProviderPort {

    String generateToken(String subject, String[] roles);

    boolean validateToken(String token);

    String getSubjectFromToken(String token);

    String[] getRolesFromToken(String token);
}