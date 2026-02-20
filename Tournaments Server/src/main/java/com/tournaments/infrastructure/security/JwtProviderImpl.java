package com.tournaments.infrastructure.security;

import java.security.Key;
import java.util.Date;
import java.util.Set;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProviderImpl implements JwtProvider {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long expirationMs = 3600000; // 1 hora

    @Override
    public String generateToken(String username, String email, Set<String> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("email", email)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    @Override
    public void invalidateToken(String token) {
        // JWT stateless: normalmente no hacemos nada aquí.
        // Si quieres blacklist, implementa aquí.
    }
}
