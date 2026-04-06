package com.tournaments.infrastructure.persistence.mappers;

import java.util.stream.Collectors;

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
            entity.getStatus(),
            entity.getPriceClient(),
            entity.getPricePlayer(),
            entity.getIsActive() != null && entity.getIsActive(),
            entity.getCreatedAt(),
            entity.getStartAt(),
            entity.getEndAt(),
            entity.getSlug(),
            GameMapper.toDomain(entity.getGame()),
            TournamentFormatMapper.toDomain(entity.getTournamentFormat()),
            entity.getIsOnline() != null ? entity.getIsOnline() : true,
            entity.getMinPlayers(),
            entity.getMaxPlayers(),
            entity.getPlatforms() != null ?
                entity.getPlatforms().stream()
                    .map(PlatformMapper::toDomain)
                    .collect(Collectors.toList()) :
                null,
            entity.getCapacity(),
            entity.getTicketsSold()
        );
    }
    
    public static TournamentEntity toEntity(Tournament domain) {
        if (domain == null) return null;
        
        TournamentEntity entity = new TournamentEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setImages(domain.getImages());
        entity.setStatus(domain.getStatus());
        entity.setPriceClient(domain.getPriceClient());
        entity.setPricePlayer(domain.getPricePlayer());
        entity.setIsActive(domain.isActive());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setStartAt(domain.getStartAt());
        entity.setEndAt(domain.getEndAt());
        entity.setSlug(domain.getSlug());
        entity.setGame(GameMapper.toEntity(domain.getGame()));
        entity.setTournamentFormat(TournamentFormatMapper.toEntity(domain.getFormat()));
        entity.setIsOnline(domain.isOnline());
        entity.setMinPlayers(domain.getMinPlayers());
        entity.setMaxPlayers(domain.getMaxPlayers());
        entity.setCapacity(domain.getCapacity());
        entity.setTicketsSold(domain.getTicketsSold());
                
        return entity;
    }
}