import React from 'react';

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

interface TournamentCardProps {
    tournament: Tournament;
    onClick: () => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onClick }) => {
    console.log('Rendering TournamentCard for:', tournament);
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onClick}
        >
            <img
                src={tournament.images[0] || '/placeholder.jpg'}
                alt={tournament.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{tournament.name}</h3>
                <div className="text-sm text-gray-600 mb-2">
                    <p>Client: ${tournament.priceClient}</p>
                    <p>Player: ${tournament.pricePlayer}</p>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                    <p>Start: {new Date(tournament.startAt).toLocaleDateString()}</p>
                    {/* <p>End: {new Date(tournament.endDate).toLocaleDateString()}</p> */}
                </div>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${tournament.status === 'active' ? 'bg-green-100 text-green-800' :
                    tournament.status === 'upcoming' ? 'bg-cyan-100 text-cyan-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {tournament.status}
                </span>
                <button className="mt-2 w-full bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default TournamentCard;