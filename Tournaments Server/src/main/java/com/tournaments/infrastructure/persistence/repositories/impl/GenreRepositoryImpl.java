package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.Genre;
import com.tournaments.domain.repository.GenreRepository;
import com.tournaments.infrastructure.persistence.mappers.GenreMapper;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaGenreRepository;

@Repository
public class GenreRepositoryImpl implements GenreRepository {

    private final JpaGenreRepository jpaGenreRepository;

    public GenreRepositoryImpl(JpaGenreRepository jpaGenreRepository) {
        this.jpaGenreRepository = jpaGenreRepository;
    }

    @Override
    public List<Genre> findAll() {
        return jpaGenreRepository.findAll().stream()
                .map(GenreMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Genre> findByIdIn(List<Long> ids) {
        return jpaGenreRepository.findByIdIn(ids).stream()
                .map(GenreMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(Long id) {
        return jpaGenreRepository.existsById(id);
    }
}