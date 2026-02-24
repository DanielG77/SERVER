package com.tournaments.infrastructure.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tournaments.domain.repository.JwtProviderPort;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtProviderPort jwtProvider;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtProviderPort jwtProvider, CustomUserDetailsService userDetailsService) {
        this.jwtProvider = jwtProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        log.debug("=== Procesando solicitud: {} {} ===", request.getMethod(), request.getRequestURI());

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            log.debug("Token recibido (primeros 20 chars): {}...", token.substring(0, Math.min(20, token.length())));
            
            try {
                username = jwtProvider.getSubjectFromToken(token);
                log.debug("Subject extraído del token: {}", username);
            } catch (Exception e) {
                log.error("❌ Error al extraer subject del token: {}", e.getMessage(), e);
            }
        } else {
            log.debug("⚠️ No hay token Bearer en la cabecera Authorization");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("Intentando cargar UserDetails para: {}", username);
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                log.debug("✅ UserDetails cargado: {}", userDetails.getUsername());
                log.debug("Authorities: {}", userDetails.getAuthorities());

                log.debug("Validando token...");
                boolean isValid = jwtProvider.validateToken(token);
                log.debug("Resultado de validación: {}", isValid);

                if (isValid) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("✅ Autenticación establecida para: {}", username);
                } else {
                    log.warn("❌ Token no válido para: {}", username);
                }
            } catch (Exception e) {
                log.error("❌ Error al cargar UserDetails o validar token: {}", e.getMessage(), e);
            }
        } else {
            if (username == null) {
                log.debug("username es null, no se establece autenticación");
            } else {
                log.debug("Ya existe autenticación en el contexto: {}", SecurityContextHolder.getContext().getAuthentication());
            }
        }

        filterChain.doFilter(request, response);
    }
}