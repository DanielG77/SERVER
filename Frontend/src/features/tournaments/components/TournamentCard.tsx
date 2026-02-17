import { Tournament } from '../../../shared/types/tournament.types';

interface TournamentCardProps {
    tournament: Tournament;
}

// Array de colores vívidos para asignar un color distinto a cada torneo (o por juego)
const vividColors = [
    'bg-vivid-blue',
    'bg-vivid-green',
    'bg-vivid-red',
    'bg-vivid-yellow',
    'bg-vivid-purple',
    'bg-vivid-pink',
    'bg-vivid-orange',
];

export const TournamentCard = ({ tournament }: TournamentCardProps) => {
    // Asignar un color según el nombre del juego (simple hash)
    const colorIndex = tournament.game.name.length % vividColors.length;
    const headerColor = vividColors[colorIndex];

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className={`${headerColor} h-2 w-full`} />
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{tournament.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{tournament.game.name}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tournament.online ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                        {tournament.online ? 'Online' : 'Presencial'}
                    </span>
                </div>

                <p className="mt-3 text-gray-600 text-sm line-clamp-2">{tournament.description}</p>

                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-gray-900">
                            ${tournament.priceClient.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">inscripción</span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Premio al jugador</p>
                        <p className="text-sm font-semibold text-gray-800">${tournament.pricePlayer.toFixed(2)}</p>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <span>📅 {new Date(tournament.startAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>👥 {tournament.minPlayers}-{tournament.maxPlayers} jug.</span>
                </div>

                <button className="mt-4 w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Ver detalles
                </button>
            </div>
        </div>
    );
};