package com.tournaments.presentation.response;

// import com.fasterxml.jackson.annotation.JsonFormat;
// import com.fasterxml.jackson.annotation.JsonInclude;
// import com.fasterxml.jackson.annotation.JsonProperty;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;
import java.util.UUID;

import com.tournaments.domain.model.Tournament;

public class TournamentResponse {
    public UUID id;
    public String name;
    public String description;
    public String slug;
    public boolean active;

    public static TournamentResponse fromDomain(Tournament t) {
        TournamentResponse r = new TournamentResponse();
        r.id = t.getId();
        r.name = t.getName();
        r.description = t.getDescription();
        r.slug = t.getSlug();
        r.active = t.isActive();
        return r;
    }
}
