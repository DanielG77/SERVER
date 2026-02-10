package com.tournaments.domain.repository;

import java.util.List;

import com.tournaments.domain.model.Platform;

public interface PlatformRepository {
    List<Platform> findAll();
    List<Platform> findByIdIn(List<Long> ids);
    boolean existsById(Long id);
}