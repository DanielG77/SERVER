import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback, useMemo } from 'react';
import { useTournament } from '../hooks/useTournament';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { reservationService } from '../services/reservationService';
import ErrorAlert from '../components/ErrorAlert';

/**
 * ImageCarousel Component - Renders a carousel of tournament images with navigation controls
 */
interface ImageCarouselProps {
    images: string[];
    tournamentName: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, tournamentName }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const hasImages = useMemo(() => images && images.length > 0, [images]);
    const canNavigate = useMemo(() => hasImages && images.length > 1, [images, hasImages]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    }, [images.length]);

    const handleDotClick = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    if (!hasImages) {
        return (
            <div className="w-full h-96 bg-slate-800 rounded-xl shadow-2xl flex items-center justify-center border border-slate-700">
                <div className="text-center">
                    <p className="text-slate-400 text-lg">No images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <img
                    src={images[currentIndex]}
                    alt={`${tournamentName} - Image ${currentIndex + 1}`}
                    className="w-full h-96 object-cover transition-opacity duration-300"
                />

                {/* Navigation Buttons - Only show if multiple images */}
                {canNavigate && (
                    <>
                        <button
                            onClick={handlePrev}
                            aria-label="Previous image"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white px-3 py-2 rounded-lg transition-all duration-200 text-xl font-bold"
                        >
                            ‹
                        </button>

                        <button
                            onClick={handleNext}
                            aria-label="Next image"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white px-3 py-2 rounded-lg transition-all duration-200 text-xl font-bold"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {/* Indicators - Only show if multiple images */}
            {canNavigate && (
                <div className="flex justify-center gap-2 mt-6">
                    {images.map((_, index) => (
                        <button
                            key={`indicator-${index}`}
                            onClick={() => handleDotClick(index)}
                            aria-label={`View image ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-blue-400 w-8'
                                : 'bg-slate-600 w-2.5 hover:bg-slate-500'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * TournamentDetails Component - Main component for displaying tournament details
 */
const TournamentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: tournament, loading, error } = useTournament(id || '');

    const { mutate: createReservation, isPending: isRegistering, error: reservationError } = useMutation({
        mutationFn: () => reservationService.createReservation(id!),
        onSuccess: (data) => {
            navigate(`/reservations/${data.id}/pay`);
        },
    });

    /**
     * Handle tournament registration
     */
    const handleRegisterNow = useCallback(async (): Promise<void> => {
        if (!user) {
            navigate('/login');
            return;
        }
        createReservation();
    }, [user, createReservation, navigate]);

    /**
     * Render loading state
     */
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
                    <p className="text-slate-300 text-lg">Loading tournament details...</p>
                </div>
            </div>
        );
    }

    /**
     * Render error state
     */
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 text-blue-400 hover:text-blue-300 transition font-medium text-lg"
                    >
                        ← Back
                    </button>

                    <div className="bg-red-950 border border-red-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-red-200 mb-3">Error Loading Tournament</h2>
                        <p className="text-red-100">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Render not found state
     */
    if (!tournament) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 text-blue-400 hover:text-blue-300 transition font-medium text-lg"
                    >
                        ← Back
                    </button>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-200 mb-3">Tournament Not Found</h2>
                        <p className="text-slate-400 mb-6">The tournament you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Back to Shop
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Format date safely
     */
    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return 'Invalid date';
        }
    };

    /**
     * Get platform names safely
     */
    const getPlatformNames = (): string => {
        if (!tournament.platforms || tournament.platforms.length === 0) {
            return 'Not specified';
        }
        return tournament.platforms.map((p) => p.name).join(', ');
    };

    /**
     * Render main content
     */
    console.log('Tournament data:', tournament); // Debug log for tournament data
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 text-blue-400 hover:text-blue-300 transition font-medium text-lg"
                >
                    ← Back
                </button>

                {/* Tournament Title */}
                <div className="mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold">
                        {tournament.name}
                    </h1>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* Left Column - Image Carousel */}
                    <div className="flex flex-col">
                        <ImageCarousel
                            images={tournament.images ?? []}
                            tournamentName={tournament.name}
                        />
                    </div>

                    {/* Right Column - Tournament Information */}
                    <div className="space-y-8">

                        {/* Tournament Info Card */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 space-y-4">
                            <h3 className="text-xl font-semibold text-blue-300 mb-4">
                                Tournament Details
                            </h3>

                            <div className="space-y-3 divide-y divide-slate-700">

                                <div className="flex justify-between items-start">
                                    <span className="text-slate-400 font-medium">Game:</span>
                                    <span className="text-slate-200">
                                        {tournament.game?.name ?? 'Not specified'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-start pt-3">
                                    <span className="text-slate-400 font-medium">Players:</span>
                                    <span className="text-slate-200">
                                        {tournament.minPlayers} - {tournament.maxPlayers}
                                    </span>
                                </div>

                                <div className="flex justify-between items-start pt-3">
                                    <span className="text-slate-400 font-medium">Start Date:</span>
                                    <span className="text-slate-200">
                                        {formatDate(tournament.startAt)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-start pt-3">
                                    <span className="text-slate-400 font-medium">End Date:</span>
                                    <span className="text-slate-200">
                                        {formatDate(tournament.endAt)}
                                    </span>
                                </div>

                                {tournament.status && (
                                    <div className="flex justify-between items-start pt-3">
                                        <span className="text-slate-400 font-medium">Status:</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${tournament.status === 'open'
                                                ? 'bg-green-900/50 text-green-300'
                                                : tournament.status === 'draft'
                                                    ? 'bg-yellow-900/50 text-yellow-300'
                                                    : 'bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            {tournament.status.charAt(0).toUpperCase() +
                                                tournament.status.slice(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {reservationError && <ErrorAlert message={(reservationError as any).message} />}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleRegisterNow}
                                disabled={isRegistering}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                {isRegistering ? 'Creating Reservation...' : 'Register Now'}
                            </button>

                            <button
                                onClick={() => navigate('/shop')}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg border border-slate-600 transition-all duration-200"
                            >
                                ← Back to Shop
                            </button>
                        </div>

                        {!user && (
                            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-blue-200 text-sm">
                                <p>Sign in to register for this tournament</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================= */}
                {/* Dedicated Description Section */}
                {/* ========================= */}

                <div className="mt-20 max-w-5xl mx-auto">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">

                        <h2 className="text-3xl font-bold mb-6 text-blue-300">
                            About This Tournament
                        </h2>

                        {tournament.description ? (
                            <div className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                                {tournament.description}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic">
                                No detailed description available for this tournament.
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TournamentDetails;