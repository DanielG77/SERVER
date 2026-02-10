package com.tournaments.application.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.service.TournamentFormatService;
import com.tournaments.domain.model.TournamentFormat;
import com.tournaments.domain.repository.TournamentFormatRepository;

@Service
public class TournamentFormatServiceImpl implements TournamentFormatService {

    private final TournamentFormatRepository tournamentFormatRepository;

    public TournamentFormatServiceImpl(TournamentFormatRepository tournamentFormatRepository) {
        this.tournamentFormatRepository = tournamentFormatRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TournamentFormat> getAllTournamentFormats() {
        return tournamentFormatRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TournamentFormat> getTournamentFormatById(Long id) {
        return tournamentFormatRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return tournamentFormatRepository.existsById(id);
    }
}