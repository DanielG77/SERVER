package com.tournaments.infrastructure.persistence.converters;

import com.tournaments.domain.enums.TournamentStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TournamentStatusConverter implements AttributeConverter<TournamentStatus, String> {

    @Override
    public String convertToDatabaseColumn(TournamentStatus status) {
        if (status == null) {
            return null;
        }
        return status.getValue(); // Usa "draft", "open", etc.
    }

    @Override
    public TournamentStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return TournamentStatus.fromString(dbData);
    }
}