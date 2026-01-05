import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { VideoSection } from "@/components/home/VideoSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogPreview } from "@/components/home/BlogPreview";
import { Newsletter } from "@/components/home/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <FeaturedCategories />
        <FeaturedProducts />
        <VideoSection />
        <Testimonials />
        <BlogPreview />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;