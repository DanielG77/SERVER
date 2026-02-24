package com.tournaments.application.service;

import java.time.OffsetDateTime;
import java.util.Set;

import com.tournaments.domain.exception.UserAlreadyExistsException;
import com.tournaments.domain.exception.ResourceNotFoundException;
import com.tournaments.domain.model.Role;
import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.PasswordEncoderPort;
import com.tournaments.domain.repository.RoleRepositoryPort;
import com.tournaments.domain.repository.UserRepositoryPort;
import com.tournaments.domain.service.UserService;

public class UserServiceImpl implements UserService {

    private final UserRepositoryPort userRepository;
    private final RoleRepositoryPort roleRepository;
    private final PasswordEncoderPort passwordEncoder;

    public UserServiceImpl(UserRepositoryPort userRepository, RoleRepositoryPort roleRepository, PasswordEncoderPort passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User createUser(String username, String email, String password) {
        if (existsByUsername(username)) {
            throw new UserAlreadyExistsException("Username already exists");
        }
        if (existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        String encodedPassword = passwordEncoder.encode(password);
        Role clientRole = roleRepository.findByName("ROLE_CLIENT").orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setEnabled(true);
        user.setCreatedAt(OffsetDateTime.now());
        user.setRoles(Set.of(clientRole));

        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User updateUser(Long id, String username, String email) {
        User user = getUserById(id);
        if (!user.getUsername().equals(username) && existsByUsername(username)) {
            throw new UserAlreadyExistsException("Username already exists");
        }
        if (!user.getEmail().equals(email) && existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email already exists");
        }
        user.setUsername(username);
        user.setEmail(email);
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}