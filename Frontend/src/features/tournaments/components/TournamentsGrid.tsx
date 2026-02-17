import { Tournament } from '../../../shared/types/tournament.types';
import { TournamentCard } from './TournamentCard';

interface TournamentsGridProps {
    tournaments: Tournament[];
}

export const TournamentsGrid = ({ tournaments }: TournamentsGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
        </div>
    );
};