package com.tournaments.application.service.impl;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.Collections;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.service.TournamentService;
import com.tournaments.domain.enums.TournamentStatus;
import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.repository.TournamentRepository;
import com.tournaments.presentation.request.CreateTournamentRequest;
import com.tournaments.presentation.request.UpdateTournamentRequest;
import com.tournaments.shared.exceptions.TournamentNotFoundException;

@Service
public class TournamentServiceImpl implements TournamentService {

    private final TournamentRepository tournamentRepository;
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public TournamentServiceImpl(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Tournament getTournamentById(UUID id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new TournamentNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Tournament getTournamentBySlug(String slug) {
        return tournamentRepository.findBySlug(slug)
                .orElseThrow(() -> new TournamentNotFoundException(slug));
    }


    @Override
    @Transactional
    public Tournament createTournament(CreateTournamentRequest request) {
        if (request.getStartAt() != null && request.getEndAt() != null) {
            if (request.getEndAt().isBefore(request.getStartAt())) {
                throw new IllegalArgumentException("End date cannot be before start date");
            }
        }

        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = generateSlug(request.getName());
        }

        if (tournamentRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Slug already exists: " + slug);
        }

        BigDecimal priceClient = request.getPriceClient() != null ? request.getPriceClient() : BigDecimal.ZERO;
        BigDecimal pricePlayer = request.getPricePlayer() != null ? request.getPricePlayer() : BigDecimal.ZERO;

        Tournament tournament = new Tournament(
                null,
                request.getName(),
                request.getDescription(),
                request.getImages() != null ? request.getImages() : Collections.emptyList(),
                TournamentStatus.fromString(request.getStatus() != null ? request.getStatus() : "draft"),
                priceClient,
                pricePlayer,
                request.isActive(),
                null,
                request.getStartAt(),
                request.getEndAt(),
                slug);

        return tournamentRepository.save(tournament);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Tournament> getAllTournaments(TournamentFilter filter, Pageable pageable) {
        return tournamentRepository.findAll(filter, pageable);
    }

    @Override
    @Transactional
    public Tournament updateTournament(UUID id, UpdateTournamentRequest request) {
        Tournament existing = getTournamentById(id);

        String newName = request.getName() != null ? request.getName() : existing.getName();
        String newDescription = request.getDescription() != null ? request.getDescription() : existing.getDescription();
        java.util.List<String> newImages = request.getImages() != null ? request.getImages() : existing.getImages();

        TournamentStatus newStatus = existing.getStatus();
        if (request.getStatus() != null) {
            newStatus = TournamentStatus.fromString(request.getStatus());
        }

        BigDecimal newPriceClient = request.getPriceClient() != null ? request.getPriceClient()
                : existing.getPriceClient();
        BigDecimal newPricePlayer = request.getPricePlayer() != null ? request.getPricePlayer()
                : existing.getPricePlayer();
        boolean newActive = request.getIsActive() != null ? request.getIsActive() : existing.isActive();
        java.time.LocalDateTime newStartAt = request.getStartAt() != null ? request.getStartAt()
                : existing.getStartAt();
        java.time.LocalDateTime newEndAt = request.getEndAt() != null ? request.getEndAt() : existing.getEndAt();

        String newSlug = existing.getSlug();
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            newSlug = request.getSlug();
            if (!newSlug.equals(existing.getSlug()) && tournamentRepository.existsBySlugAndIdNot(newSlug, id)) {
                throw new IllegalArgumentException("Slug already exists: " + newSlug);
            }
        }

        if (newStartAt != null && newEndAt != null && newEndAt.isBefore(newStartAt)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        Tournament updated = new Tournament(
                existing.getId(),
                newName,
                newDescription,
                newImages,
                newStatus,
                newPriceClient,
                newPricePlayer,
                newActive,
                existing.getCreatedAt(),
                newStartAt,
                newEndAt,
                newSlug);

        return tournamentRepository.save(updated);
    }

    @Override
    @Transactional
    public void deleteTournament(UUID id, boolean hardDelete) {
        Tournament existing = getTournamentById(id);

        if (hardDelete) {
            tournamentRepository.delete(id);
        } else {
            Tournament softDeleted = new Tournament(
                    existing.getId(),
                    existing.getName(),
                    existing.getDescription(),
                    existing.getImages(),
                    existing.getStatus(),
                    existing.getPriceClient(),
                    existing.getPricePlayer(),
                    false,
                    existing.getCreatedAt(),
                    existing.getStartAt(),
                    existing.getEndAt(),
                    existing.getSlug());
            tournamentRepository.save(softDeleted);
        }
    }

    private String generateSlug(String input) {
        if (input == null)
            return "";
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
