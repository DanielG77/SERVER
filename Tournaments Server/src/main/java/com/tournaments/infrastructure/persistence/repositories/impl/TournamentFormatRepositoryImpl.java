package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.TournamentFormat;
import com.tournaments.domain.repository.TournamentFormatRepository;
import com.tournaments.infrastructure.persistence.mappers.TournamentFormatMapper;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentFormatRepository;

@Repository
public class TournamentFormatRepositoryImpl implements TournamentFormatRepository {

    private final JpaTournamentFormatRepository jpaTournamentFormatRepository;

    public TournamentFormatRepositoryImpl(JpaTournamentFormatRepository jpaTournamentFormatRepository) {
        this.jpaTournamentFormatRepository = jpaTournamentFormatRepository;
    }

    @Override
    public List<TournamentFormat> findAll() {
        return jpaTournamentFormatRepository.findAll().stream()
                .map(TournamentFormatMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TournamentFormat> findById(Long id) {
        return jpaTournamentFormatRepository.findById(id)
                .map(TournamentFormatMapper::toDomain);
    }

    @Override
    public Optional<TournamentFormat> findByName(String name) {
        return jpaTournamentFormatRepository.findByName(name)
                .map(TournamentFormatMapper::toDomain);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaTournamentFormatRepository.existsById(id);
    }
}