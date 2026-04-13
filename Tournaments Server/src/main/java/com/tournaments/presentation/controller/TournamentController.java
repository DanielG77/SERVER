package com.tournaments.presentation.controller;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.tournaments.application.service.TournamentService;
import com.tournaments.domain.enums.TournamentStatus;
import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.pagination.DomainPage;
import com.tournaments.domain.pagination.PageableRequest;
import com.tournaments.infrastructure.security.CustomUserDetails;
import com.tournaments.presentation.request.CancelTournamentRequest;
import com.tournaments.presentation.request.CreateTournamentRequest;
import com.tournaments.presentation.request.UpdateTournamentRequest;
import com.tournaments.presentation.response.ApiResponse;
import com.tournaments.presentation.response.CancelTournamentResponse;
import com.tournaments.presentation.response.PaginationMeta;

import jakarta.validation.Valid;

@RestController
@RequestMapping("tournaments")
@Validated
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Tournament>> create(
            @Valid @RequestBody CreateTournamentRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        Tournament created = tournamentService.createTournament(request, currentUser);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Tournament>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, name = "is_active") Boolean isActive,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "created_at:desc") String sort,

            // Additional filters
            @RequestParam(required = false) Long gameId,
            @RequestParam(required = false) List<Long> genreIds,
            @RequestParam(required = false) List<Long> platformIds,
            @RequestParam(required = false) Long formatId,
            @RequestParam(required = false) Boolean isOnline,
            @RequestParam(required = false) Integer minPlayers,
            @RequestParam(required = false) Integer maxPlayers) {
        // Parse sort param: "created_at:desc" → field + direction
        String[] sortParams = sort.split(":");
        String sortField = sortParams[0];
        String sortDir = sortParams.length > 1 ? sortParams[1] : PageableRequest.DEFAULT_SORT_DIRECTION;

        // Map snake_case API field names → camelCase JPA field names
        if (sortField.equals("created_at"))
            sortField = "createdAt";
        if (sortField.equals("start_at"))
            sortField = "startAt";

        // Build domain pagination request (convert 1-based page to 0-based)
        PageableRequest pageableRequest = new PageableRequest(
                page > 0 ? page - 1 : 0,
                limit,
                sortField,
                sortDir);

        // Convert status query param
        TournamentStatus tournamentStatus = null;
        if (status != null) {
            tournamentStatus = TournamentStatus.fromString(status);
        }

        // Build filter
        TournamentFilter filter = new TournamentFilter(
                tournamentStatus,
                isActive,
                from,
                to,
                q,
                gameId,
                genreIds != null ? genreIds : List.of(),
                platformIds != null ? platformIds : List.of(),
                formatId,
                isOnline,
                minPlayers,
                maxPlayers);

        DomainPage<Tournament> result = tournamentService.getAllTournaments(filter, pageableRequest);
        PaginationMeta meta = new PaginationMeta(result.getTotalElements(), page, limit);
        return ResponseEntity.ok(ApiResponse.success(result.getContent(), meta));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tournament>> getById(@PathVariable UUID id) {
        Tournament tournament = tournamentService.getTournamentById(id);
        return ResponseEntity.ok(ApiResponse.success(tournament));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Tournament>> getBySlug(@PathVariable String slug) {
        Tournament tournament = tournamentService.getTournamentBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(tournament));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Tournament>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTournamentRequest request) {
        Tournament updated = tournamentService.updateTournament(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "false") boolean hard) {
        tournamentService.deleteTournament(id, hard);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<CancelTournamentResponse>> cancelTournament(
            @PathVariable UUID id,
            @Valid @RequestBody(required = false) CancelTournamentRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (request == null) {
            request = new CancelTournamentRequest();
        }
        CancelTournamentResponse response = tournamentService.cancelTournament(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
