import CategoriesSection from './CategoriesCard';
import LatestTournamentsSection from './LatestTournamentsSection';
import HeroCarousel from './HeroCarrusel';


export const HomePage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-800">
            {/* HERO */}
            {/* <section className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                        Descubre los mejores torneos
                    </h1>
                    <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
                        Compite, gana premios y forma parte de la comunidad competitiva más activa.
                    </p>


                    <div className="mt-10 flex justify-center gap-4">
                        <button className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                            Explorar torneos
                        </button>
                        <button className="px-6 py-3 rounded-xl border border-gray-300 text-sm font-medium hover:bg-slate-50 transition-colors">
                            Crear torneo
                        </button>
                    </div>
                </div>
            </section> */}
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