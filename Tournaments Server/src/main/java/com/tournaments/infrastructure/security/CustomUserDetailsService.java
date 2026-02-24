package com.tournaments.infrastructure.security;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.UserRepositoryPort;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepositoryPort userRepository;

    public CustomUserDetailsService(
            @Qualifier("userRepositoryJpaAdapter") UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

   @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        
        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getName()))
                    .collect(Collectors.toList())
        );
    }
}