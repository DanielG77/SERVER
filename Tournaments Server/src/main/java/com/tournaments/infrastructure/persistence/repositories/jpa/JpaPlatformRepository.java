package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tournaments.infrastructure.persistence.entities.PlatformEntity;

public interface JpaPlatformRepository extends JpaRepository<PlatformEntity, Long> {
    List<PlatformEntity> findByIdIn(List<Long> ids);
    List<PlatformEntity> findByOrderByNameAsc();
}