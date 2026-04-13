package com.tournaments.application.service.impl;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.Collections;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.service.GameService;
import com.tournaments.application.service.TournamentFormatService;
import com.tournaments.application.service.TournamentService;
import com.tournaments.application.usecase.CancelTournamentUseCase;
import com.tournaments.domain.enums.TournamentStatus;
import com.tournaments.domain.model.Game;
import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.model.TournamentFormat;
import com.tournaments.domain.pagination.DomainPage;
import com.tournaments.domain.pagination.PageableRequest;
import com.tournaments.domain.repository.TournamentRepository;
import com.tournaments.infrastructure.security.CustomUserDetails;
import com.tournaments.presentation.request.CreateTournamentRequest;
import com.tournaments.presentation.request.UpdateTournamentRequest;
import com.tournaments.presentation.request.CancelTournamentRequest;
import com.tournaments.presentation.response.CancelTournamentResponse;
import com.tournaments.shared.exceptions.TournamentNotFoundException;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentRepository;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

@Service
public class TournamentServiceImpl implements TournamentService {

    private static final Logger logger = LoggerFactory.getLogger(TournamentServiceImpl.class);

    private final TournamentRepository tournamentRepository;
    private final JpaTournamentRepository jpaTournamentRepository;
    private final GameService gameService;
    private final TournamentFormatService tournamentFormatService;
    private final CancelTournamentUseCase cancelTournamentUseCase;
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public TournamentServiceImpl(
            TournamentRepository tournamentRepository,
            JpaTournamentRepository jpaTournamentRepository,
            GameService gameService,
            TournamentFormatService tournamentFormatService,
            CancelTournamentUseCase cancelTournamentUseCase) {
        this.tournamentRepository = tournamentRepository;
        this.jpaTournamentRepository = jpaTournamentRepository;
        this.gameService = gameService;
        this.tournamentFormatService = tournamentFormatService;
        this.cancelTournamentUseCase = cancelTournamentUseCase;
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
    public Tournament createTournament(CreateTournamentRequest request, CustomUserDetails currentUser) {
        // Validar fechas
        if (request.getStartAt() != null && request.getEndAt() != null) {
            if (request.getEndAt().isBefore(request.getStartAt())) {
                throw new IllegalArgumentException("End date cannot be before start date");
            }
        }

        // Validar que el juego existe
        Game game = gameService.getGameById(request.getGameId())
                .orElseThrow(() -> new IllegalArgumentException("Game not found with id: " + request.getGameId()));

        // Validar que el formato existe (si se proporciona)
        TournamentFormat format = null;
        if (request.getFormatId() != null) {
            format = tournamentFormatService.getTournamentFormatById(request.getFormatId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Tournament format not found with id: " + request.getFormatId()));
        }

        // Validar número de jugadores
        if (request.getMinPlayers() != null && request.getMinPlayers() <= 0) {
            throw new IllegalArgumentException("Minimum players must be greater than 0");
        }
        if (request.getMaxPlayers() != null && request.getMinPlayers() != null
                && request.getMaxPlayers() < request.getMinPlayers()) {
            throw new IllegalArgumentException("Maximum players cannot be less than minimum players");
        }

        // Generar slug
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
                slug,
                game,
                format,
                request.getIsOnline() != null ? request.getIsOnline() : true,
                request.getMinPlayers() != null ? request.getMinPlayers() : 1,
                request.getMaxPlayers(),
                null, /* platforms */
                request.getCapacity(),
                0, /* ticketsSold */
                currentUser.getId() /* ownerId */
        );

        return tournamentRepository.save(tournament);
    }

    @Override
    @Transactional(readOnly = true)
    public DomainPage<Tournament> getAllTournaments(TournamentFilter filter, PageableRequest pageableRequest) {
        return tournamentRepository.findAll(filter, pageableRequest);
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

        // Actualizar juego (si se proporciona)
        Game newGame = existing.getGame();
        if (request.getGameId() != null) {
            newGame = gameService.getGameById(request.getGameId())
                    .orElseThrow(() -> new IllegalArgumentException("Game not found with id: " + request.getGameId()));
        }

        // Actualizar formato (si se proporciona)
        TournamentFormat newFormat = existing.getFormat();
        if (request.getFormatId() != null) {
            newFormat = tournamentFormatService.getTournamentFormatById(request.getFormatId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Tournament format not found with id: " + request.getFormatId()));
        }

        // Actualizar otros campos
        boolean newIsOnline = request.getIsOnline() != null ? request.getIsOnline() : existing.isOnline();
        Integer newMinPlayers = request.getMinPlayers() != null ? request.getMinPlayers() : existing.getMinPlayers();
        Integer newMaxPlayers = request.getMaxPlayers() != null ? request.getMaxPlayers() : existing.getMaxPlayers();
        Integer newCapacity = request.getCapacity() != null ? request.getCapacity() : existing.getCapacity();

        // Validar número de jugadores
        if (newMinPlayers != null && newMinPlayers <= 0) {
            throw new IllegalArgumentException("Minimum players must be greater than 0");
        }
        if (newMaxPlayers != null && newMinPlayers != null && newMaxPlayers < newMinPlayers) {
            throw new IllegalArgumentException("Maximum players cannot be less than minimum players");
        }

        // Actualizar slug
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
                newSlug,
                newGame,
                newFormat,
                newIsOnline,
                newMinPlayers,
                newMaxPlayers,
                existing.getPlatforms(),
                newCapacity,
                existing.getTicketsSold(),
                existing.getOwnerId()
        );

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
                    existing.getSlug(),
                    existing.getGame(),
                    existing.getFormat(),
                    existing.isOnline(),
                    existing.getMinPlayers(),
                    existing.getMaxPlayers(),
                    existing.getPlatforms(),
                    existing.getCapacity(),
                    existing.getTicketsSold(),
                    existing.getOwnerId());
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

    @Override
    @Transactional
    public CancelTournamentResponse cancelTournament(UUID id, CancelTournamentRequest request, 
            CustomUserDetails currentUser) {
        logger.info("=== BEGIN CANCEL TOURNAMENT {} ===", id);
        
        try {
            // 1. Ejecutar el usecase de cancelación (procesa reembolsos Stripe)
            logger.debug("Executing CancelTournamentUseCase for tournament {}", id);
            CancelTournamentUseCase.CancelTournamentResult result = cancelTournamentUseCase.execute(id, currentUser);
            
            logger.info("CancelTournamentUseCase completed: refunded={}, failed={}",
                result.getRefundedCount(), result.getFailedRefunds().size());

            // 2. ✅ SOLUCIÓN: Cargar la entidad JPA directamente (no a través del mapper)
            //    Esto preserva TODAS las relaciones existentes, especialmente 'owner'
            logger.debug("Loading tournament entity for status update");
            TournamentEntity existingEntity = jpaTournamentRepository.findById(id)
                    .orElseThrow(() -> new TournamentNotFoundException(id));

            // 3. ✅ Actualizar SOLO el campo status en la entidad persistida
            //    Hibernacte usa "dirty checking" para detectar cambios
            //    Si la entidad está dentro de la transacción, se guardará automáticamente
            existingEntity.setStatus(TournamentStatus.CANCELLED);
            logger.info("Tournament status updated to CANCELLED");
            
            // 4. Guardar explícitamente (aunque Hibernate lo haría automáticamente)
            jpaTournamentRepository.save(existingEntity);
            logger.info("Tournament entity persisted to database");

            // 5. Construir y retornar la respuesta
            logger.info("=== END CANCEL TOURNAMENT {} (SUCCESS) ===", id);
            
            return CancelTournamentResponse.builder()
                    .tournamentId(result.getTournamentId())
                    .newStatus(result.getNewStatus())
                    .refundedCount(result.getRefundedCount())
                    .failedRefunds(result.getFailedRefunds().stream()
                            .map(f -> CancelTournamentResponse.FailedRefund.builder()
                                    .paymentId(f.getPaymentId())
                                    .errorMessage(f.getErrorMessage())
                                    .build())
                            .toList())
                    .build();
                    
        } catch (DataIntegrityViolationException e) {
            logger.error("=== END CANCEL TOURNAMENT {} (DATA INTEGRITY VIOLATION) ===", id);
            logger.error("Database constraint violation during tournament cancellation: {}", 
                e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error("=== END CANCEL TOURNAMENT {} (FAILED) ===", id);
            logger.error("Unexpected error during tournament cancellation", e);
            throw e;
        }
    }
}