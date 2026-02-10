package com.tournaments.infrastructure.persistence.mappers;

import com.tournaments.domain.model.TournamentFormat;
import com.tournaments.infrastructure.persistence.entities.TournamentFormatEntity;

public class TournamentFormatMapper {
    
    public static TournamentFormat toDomain(TournamentFormatEntity entity) {
        if (entity == null) return null;
        
        return new TournamentFormat(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getMinPlayers(),
            entity.getMaxPlayers()
        );
    }
    
    public static TournamentFormatEntity toEntity(TournamentFormat domain) {
        if (domain == null) return null;
        
        TournamentFormatEntity entity = new TournamentFormatEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setMinPlayers(domain.getMinPlayers());
        entity.setMaxPlayers(domain.getMaxPlayers());
        
        return entity;
    }
}