package com.tournaments.infrastructure.persistence.repositories;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.tournaments.application.service.impl.AuthServiceImpl;
import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.UserRepositoryPort;
import com.tournaments.infrastructure.persistence.entities.UserEntity;
import com.tournaments.infrastructure.persistence.mappers.UserEntityMapper;

@Repository
public class UserRepositoryJpaAdapter implements UserRepositoryPort {
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final JpaUserRepository jpaRepository;
    private final UserEntityMapper mapper;

    public UserRepositoryJpaAdapter(JpaUserRepository jpaRepository, UserEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        log.debug("Buscando usuario por username: '{}'", username);
        Optional<UserEntity> entityOpt = jpaRepository.findByUsername(username);
        if (entityOpt.isPresent()) {
            UserEntity entity = entityOpt.get();
            log.debug("Entidad encontrada: {}", entity.getUsername());
            try {
                User user = mapper.toDomain(entity);
                if (user == null) {
                    log.error("Mapper devolvió null para la entidad: {}", entity.getUsername());
                    return Optional.empty();
                }
                log.debug("Usuario mapeado correctamente: {}", user.getUsername());
                return Optional.of(user);
            } catch (Exception e) {
                log.error("Error al mapear la entidad: {}", e.getMessage(), e);
                return Optional.empty();
            }
        } else {
            log.debug("No se encontró entidad con username: '{}'", username);
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(mapper::toDomain);
    }

    @Override
    public User save(User user) {
        UserEntity entity = mapper.toEntity(user);
        UserEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }
}