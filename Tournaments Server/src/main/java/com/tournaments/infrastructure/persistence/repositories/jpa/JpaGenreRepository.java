package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tournaments.infrastructure.persistence.entities.GenreEntity;

public interface JpaGenreRepository extends JpaRepository<GenreEntity, Long> {
    List<GenreEntity> findByIdIn(List<Long> ids);
    List<GenreEntity> findByOrderByNameAsc();
}