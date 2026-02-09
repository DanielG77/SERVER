export enum TournamentStatus {
    UPCOMING = 'upcoming',
    REGISTRATION_OPEN = 'registration_open',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum GameCategory {
    FPS = 'fps',
    MOBA = 'moba',
    BATTLE_ROYALE = 'battle_royale',
    SPORTS = 'sports',
    FIGHTING = 'fighting',
    RACING = 'racing',
    STRATEGY = 'strategy',
    CARD = 'card'
}

export interface Tournament {
    id: string;
    slug: string;
    name: string;
    description: string;
    game: string;
    gameCategory: GameCategory;
    platform: string[];
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    maxParticipants: number;
    currentParticipants: number;
    prizePool: number;
    entryFee: number;
    status: TournamentStatus;
    rules: string[];
    contactEmail: string;
    organizer: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    bannerImage?: string;
    gameIcon?: string;
}

export interface TournamentCreateDto {
    name: string;
    description: string;
    game: string;
    gameCategory: GameCategory;
    platform: string[];
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    maxParticipants: number;
    prizePool: number;
    entryFee: number;
    rules: string[];
    contactEmail: string;
    organizer: string;
    tags: string[];
}

export interface TournamentUpdateDto extends Partial<TournamentCreateDto> { }

export interface TournamentFilters {
    status?: TournamentStatus | TournamentStatus[];
    gameCategory?: GameCategory | GameCategory[];
    search?: string;
    minPrizePool?: number;
    maxEntryFee?: number;
    startDateFrom?: string;
    startDateTo?: string;
    organizer?: string;
    platform?: string;
}

export interface TournamentSortOptions {
    field: 'startDate' | 'prizePool' | 'entryFee' | 'currentParticipants';
    order: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
}