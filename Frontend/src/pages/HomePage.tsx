// import CategoriesSection from '../features/tournaments/components/CategoriesCard';
import { CategoriesSection } from '@/features/tournaments/components/CategoriesSection';
import HeroCarousel from '../features/tournaments/components/HeroCarrusel';
import { RecentTournamentsSection } from '@/features/tournaments/components/RecentTournamentsSection';


export const HomePage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-800">
            <HeroCarousel />

            <RecentTournamentsSection />

            <CategoriesSection />
        </div>
    );
};