package com.tournaments.infrastructure.persistence.mappers;

import com.tournaments.domain.model.Tournament;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

public class TournamentMapper {
    
    public static Tournament toDomain(TournamentEntity entity) {
        if (entity == null) return null;
        
        return new Tournament(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getImages(),
            entity.getStatus(), // ← YA ES TournamentStatus, NO necesita fromString
            entity.getPriceClient(),
            entity.getPricePlayer(),
            entity.getIsActive() != null && entity.getIsActive(),
            entity.getCreatedAt(),
            entity.getStartAt(),
            entity.getEndAt(),
            entity.getSlug()
        );
    }
    
    public static TournamentEntity toEntity(Tournament domain) {
        if (domain == null) return null;
        
        TournamentEntity entity = new TournamentEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setImages(domain.getImages());
        entity.setStatus(domain.getStatus()); // ← YA ES TournamentStatus
        entity.setPriceClient(domain.getPriceClient());
        entity.setPricePlayer(domain.getPricePlayer());
        entity.setIsActive(domain.isActive());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setStartAt(domain.getStartAt());
        entity.setEndAt(domain.getEndAt());
        entity.setSlug(domain.getSlug());
        
        return entity;
    }
}