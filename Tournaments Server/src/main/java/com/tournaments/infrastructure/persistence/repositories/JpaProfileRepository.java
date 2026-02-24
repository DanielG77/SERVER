package com.tournaments.infrastructure.persistence.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tournaments.infrastructure.persistence.entities.ProfileEntity;

public interface JpaProfileRepository extends JpaRepository<ProfileEntity, Long> {

    Optional<ProfileEntity> findByUserId(Long userId);

    @Query("SELECT p FROM ProfileEntity p WHERE p.userId = (SELECT u.id FROM UserEntity u WHERE u.username = :username)")
    Optional<ProfileEntity> findByUsername(@Param("username") String username);

    void deleteByUserId(Long userId);
}