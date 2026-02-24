package com.tournaments.infrastructure.security;

import java.security.Key;
import java.util.Date;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProviderImpl implements JwtProvider {

    @Value("${JWT_SECRET}")      // ⬅ Lee la clave desde application.properties
    private String secret;

    private final long expirationMs = 3600000; // 1 hora

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);   // ⬅ decodifica base64
        return Keys.hmacShaKeyFor(keyBytes);                // ⬅ crea clave válida para HS256
    }

    @Override
    public String generateToken(String username, String email, Set<String> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("email", email)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // ⬅ usando tu clave base64 real
                .compact();
    }

    @Override
    public void invalidateToken(String token) {
        // Normalmente nada porque JWT es stateless
    }
}