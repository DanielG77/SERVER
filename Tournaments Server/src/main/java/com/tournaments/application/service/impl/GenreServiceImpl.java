package com.tournaments.application.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.service.GenreService;
import com.tournaments.domain.model.Genre;
import com.tournaments.domain.repository.GenreRepository;

@Service
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;

    public GenreServiceImpl(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Genre> getGenresByIds(List<Long> ids) {
        return genreRepository.findByIdIn(ids);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return genreRepository.existsById(id);
    }
}