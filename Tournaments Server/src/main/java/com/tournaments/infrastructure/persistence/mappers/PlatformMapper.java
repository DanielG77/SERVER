package com.tournaments.infrastructure.persistence.mappers;

import com.tournaments.domain.model.Platform;
import com.tournaments.infrastructure.persistence.entities.PlatformEntity;

public class PlatformMapper {
    
    public static Platform toDomain(PlatformEntity entity) {
        if (entity == null) return null;
        
        return new Platform(
            entity.getId(),
            entity.getName(),
            entity.getIcon()
        );
    }
    
    public static PlatformEntity toEntity(Platform domain) {
        if (domain == null) return null;
        
        PlatformEntity entity = new PlatformEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setIcon(domain.getIcon());
        
        return entity;
    }
}