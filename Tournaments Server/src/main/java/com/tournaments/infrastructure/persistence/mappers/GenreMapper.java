package com.tournaments.infrastructure.persistence.mappers;

import com.tournaments.domain.model.Genre;
import com.tournaments.infrastructure.persistence.entities.GenreEntity;

public class GenreMapper {
    
    public static Genre toDomain(GenreEntity entity) {
        if (entity == null) return null;
        
        return new Genre(
            entity.getId(),
            entity.getName()
        );
    }
    
    public static GenreEntity toEntity(Genre domain) {
        if (domain == null) return null;
        
        GenreEntity entity = new GenreEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        
        return entity;
    }
}