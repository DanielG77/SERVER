import React from 'react';
import TournamentCard from './TournamentCard';

interface Tournament {
    id: string;
    name: string;
    images: string[];
    priceClient: number;
    pricePlayer: number;
    startAt: string;
    endDate: string;
    status: string;
}

interface TournamentListProps {
    tournaments: Tournament[];
    loading: boolean;
    onTournamentClick: (tournament: Tournament) => void;
}

const TournamentList: React.FC<TournamentListProps> = ({
    tournaments,
    loading,
    onTournamentClick,
}) => {
    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {tournaments.map((tournament) => (
                <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onClick={() => onTournamentClick(tournament)}
                />
            ))}
        </div>
    );
};

export default TournamentList;