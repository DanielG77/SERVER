// import CategoriesSection from '../features/tournaments/components/CategoriesCard';
import LatestTournamentsSection from '../features/tournaments/components/LatestTournamentsSection';
// import HeroCarousel from '../features/tournaments/components/HeroCarrusel';


export const HomePage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-800">
            {/* HERO */}
            {/* <HeroCarousel /> */}


            {/* CATEGORIES */}
            {/* <div className="bg-slate-50"> */}
            {/* <CategoriesSection /> */}
            {/* </div> */}


            {/* LATEST TOURNAMENTS */}
            <div className="bg-white border-t border-gray-100">
                <LatestTournamentsSection />
            </div>
        </div>
    );
};