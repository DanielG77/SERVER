package com.tournaments.infrastructure.persistence.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.infrastructure.persistence.entities.GameEntity;
import com.tournaments.infrastructure.persistence.entities.GenreEntity;
import com.tournaments.infrastructure.persistence.entities.PlatformEntity;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class TournamentSpecification {

    /**
     * Active tournaments only (isActive = true)
     */
    public static Specification<TournamentEntity> active() {
        return (root, query, cb) -> cb.equal(root.get("isActive"), true);
    }

    public static Specification<TournamentEntity> withFilter(TournamentFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // --- FILTROS EXISTENTES ---
            if (filter.status() != null) {
                predicates.add(cb.equal(root.get("status"), filter.status()));
            }

            if (filter.isActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), filter.isActive()));
            }

            if (filter.startAtFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startAt"), filter.startAtFrom()));
            }

            if (filter.startAtTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startAt"), filter.startAtTo()));
            }

            if (filter.search() != null && !filter.search().isBlank()) {
                String likePattern = "%" + filter.search().toLowerCase() + "%";
                // Buscar también en el nombre del juego
                Join<TournamentEntity, GameEntity> gameJoin = root.join("game", JoinType.LEFT);
                Predicate namePredicate = cb.like(cb.lower(root.get("name")), likePattern);
                Predicate gameNamePredicate = cb.like(cb.lower(gameJoin.get("name")), likePattern);
                predicates.add(cb.or(namePredicate, gameNamePredicate));
            }

            // --- NUEVOS FILTROS ---

            // 1. Filtrar por ID de juego (exacto)
            if (filter.gameId() != null) {
                predicates.add(cb.equal(root.get("game").get("id"), filter.gameId()));
            }

            // 2. Filtrar por ID de formato de torneo (exacto)
            if (filter.formatId() != null) {
                predicates.add(cb.equal(root.get("tournamentFormat").get("id"), filter.formatId()));
            }

            // 3. Filtrar por online/presencial
            if (filter.isOnline() != null) {
                predicates.add(cb.equal(root.get("isOnline"), filter.isOnline()));
            }

            // 4. Filtrar por número mínimo de jugadores (mayor o igual)
            if (filter.minPlayers() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("minPlayers"), filter.minPlayers()));
            }

            // 5. Filtrar por número máximo de jugadores (menor o igual)
            if (filter.maxPlayers() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("maxPlayers"), filter.maxPlayers()));
            }

            // 6. Filtrar por lista de géneros (varios IDs, relación indirecta)
            if (filter.genreIds() != null && !filter.genreIds().isEmpty()) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<TournamentEntity> subRoot = subquery.from(TournamentEntity.class);
                Join<TournamentEntity, GameEntity> subGameJoin = subRoot.join("game");
                Join<GameEntity, GenreEntity> subGenreJoin = subGameJoin.join("genres");
                
                subquery.select(subRoot.get("id"))
                        .where(
                            cb.equal(subRoot.get("id"), root.get("id")),
                            subGenreJoin.get("id").in(filter.genreIds())
                        );
                
                predicates.add(cb.exists(subquery));
            }

            // 7. Filtrar por lista de plataformas (varios IDs, relación directa)
            if (filter.platformIds() != null && !filter.platformIds().isEmpty()) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<TournamentEntity> subRoot = subquery.from(TournamentEntity.class);
                Join<TournamentEntity, PlatformEntity> subPlatformJoin = subRoot.join("platforms");
                
                subquery.select(subRoot.get("id"))
                        .where(
                            cb.equal(subRoot.get("id"), root.get("id")),
                            subPlatformJoin.get("id").in(filter.platformIds())
                        );
                
                predicates.add(cb.exists(subquery));
            }

            // Construir la consulta con todos los predicados AND
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}