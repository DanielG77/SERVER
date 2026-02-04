package com.tournaments.infrastructure.persistence.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

import jakarta.persistence.criteria.Predicate;

public class TournamentSpecification {

    public static Specification<TournamentEntity> withFilter(TournamentFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.status() != null) {
                predicates.add(cb.equal(root.get("status"), filter.status()));
            }

            if (filter.isActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), filter.isActive()));
            }

            if (filter.startDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startAt"), filter.startDateFrom()));
            }

            if (filter.startDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startAt"), filter.startDateTo()));
            }

            if (filter.search() != null && !filter.search().isBlank()) {
                String likePattern = "%" + filter.search().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), likePattern));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
