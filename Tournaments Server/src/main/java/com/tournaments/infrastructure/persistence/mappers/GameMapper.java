package com.tournaments.infrastructure.persistence.mappers;

// import java.util.stream.Collectors;
import java.util.List;

import com.tournaments.domain.model.Game;
import com.tournaments.infrastructure.persistence.entities.GameEntity;

public class GameMapper {

    // public static Game toDomain(GameEntity entity) {
    //     if (entity == null) return null;

    //     return new Game(
    //         entity.getId(),
    //         entity.getName(),
    //         entity.getDescription(),
    //         entity.getIconUrl(),
    //         entity.getReleaseDate(),
    //         entity.getGenres() != null ? 
    //             entity.getGenres().stream()
    //                 .map(GenreMapper::toDomain)
    //                 .collect(Collectors.toList()) : 
    //             null
    //     );
    // }
    public static Game toDomain(GameEntity entity) {
        if (entity == null) return null;
        return new Game(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getIconUrl(),
            entity.getReleaseDate(),
            List.of() // 👈 quitar géneros temporalmente
        );
    }

    public static GameEntity toEntity(Game domain) {
        if (domain == null)
            return null;

        GameEntity entity = new GameEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setIconUrl(domain.getIconUrl());
        entity.setReleaseDate(domain.getReleaseDate());
        // Nota: Los géneros no se setean aquí para evitar recursividad
        // Se manejan en el servicio/repositorio

        return entity;
    }
}