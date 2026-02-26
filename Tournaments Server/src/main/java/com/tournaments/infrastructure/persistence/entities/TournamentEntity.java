package com.tournaments.infrastructure.persistence.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.tournaments.domain.enums.TournamentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "tournaments", schema = "public")
public class TournamentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "images", columnDefinition = "jsonb", nullable = false)
    private List<String> images;

    @Column(name = "status", nullable = false)
    @Convert(converter = com.tournaments.infrastructure.persistence.converters.TournamentStatusConverter.class)
    private TournamentStatus status;

    @Column(name = "price_client", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceClient;

    @Column(name = "price_player", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePlayer;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "start_at")
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    // === NUEVOS CAMPOS Y RELACIONES ===
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity owner;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private GameEntity game;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_format_id")
    private TournamentFormatEntity tournamentFormat;
    
    @Column(name = "is_online", nullable = false)
    private Boolean isOnline = true;
    
    @Column(name = "min_players")
    private Integer minPlayers = 1;
    
    @Column(name = "max_players")
    private Integer maxPlayers;
    
    @ManyToMany
    @JoinTable(
        name = "tournament_platforms",
        joinColumns = @JoinColumn(name = "tournament_id"),
        inverseJoinColumns = @JoinColumn(name = "platform_id")
    )
    private Set<PlatformEntity> platforms;

    public TournamentEntity() {
        this.createdAt = LocalDateTime.now();
        this.images = List.of();
    }

    // === GETTERS Y SETTERS EXISTENTES ===
    
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images != null ? images : List.of();
    }

    public TournamentStatus getStatus() {
        return status;
    }

    public void setStatus(TournamentStatus status) {
        this.status = status;
    }

    public BigDecimal getPriceClient() {
        return priceClient;
    }

    public void setPriceClient(BigDecimal priceClient) {
        this.priceClient = priceClient;
    }

    public BigDecimal getPricePlayer() {
        return pricePlayer;
    }

    public void setPricePlayer(BigDecimal pricePlayer) {
        this.pricePlayer = pricePlayer;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDateTime startAt) {
        this.startAt = startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
        this.endAt = endAt;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    // === GETTERS Y SETTERS PARA OWNER ===
    
    public UserEntity getOwner() {
        return owner;
    }

    public void setOwner(UserEntity owner) {
        this.owner = owner;
    }

    // === GETTERS Y SETTERS NUEVOS ===
    
    public GameEntity getGame() {
        return game;
    }

    public void setGame(GameEntity game) {
        this.game = game;
    }

    public TournamentFormatEntity getTournamentFormat() {
        return tournamentFormat;
    }

    public void setTournamentFormat(TournamentFormatEntity tournamentFormat) {
        this.tournamentFormat = tournamentFormat;
    }

    public Boolean getIsOnline() {
        return isOnline;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }

    public Integer getMinPlayers() {
        return minPlayers;
    }

    public void setMinPlayers(Integer minPlayers) {
        this.minPlayers = minPlayers;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public Set<PlatformEntity> getPlatforms() {
        return platforms;
    }

    public void setPlatforms(Set<PlatformEntity> platforms) {
        this.platforms = platforms;
    }

    // === MÉTODOS UTILITARIOS ===
    
    public void addPlatform(PlatformEntity platform) {
        this.platforms.add(platform);
        platform.getTournaments().add(this);
    }
    
    public void removePlatform(PlatformEntity platform) {
        this.platforms.remove(platform);
        platform.getTournaments().remove(this);
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (images == null) {
            images = List.of();
        }
    }
}