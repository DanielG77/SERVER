// Tournaments Features
import { CategoriesSection } from '../features/tournaments/components/CategoriesSection';
import HeroCarousel from '../features/tournaments/components/HeroCarrusel';
import { RecentTournamentsSection } from '../features/tournaments/components/RecentTournamentsSection';

// Home Sections
import { BusinessLinesSection } from '../components/home/BusinessLinesSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { MetricsSection } from '../components/home/MetricsSection';
import { ShopSection } from '../components/home/ShopSection';
import { CTASection } from '../components/home/CTASection';
import { Footer } from '../components/Footer';

export const HomePage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Section 1: Hero Carousel */}
            <HeroCarousel />

            {/* Section 2: Business Lines - 3 revenue streams */}
            <BusinessLinesSection />

            {/* Section 3: Features & Benefits */}
            <FeaturesSection />

            {/* Section 4: Recent Tournaments */}
            <RecentTournamentsSection />

            {/* Section 5: Metrics - Social Proof */}
            <MetricsSection />

            {/* Section 6: Categories */}
            <CategoriesSection />

            {/* Section 7: Featured Products / Shop */}
            <ShopSection />

            {/* Section 8: Final CTA */}
            <CTASection />

            {/* Section 9: Footer */}
            <Footer />
        </div>
    );
};