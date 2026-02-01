import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div data-start-interview>
        <HeroSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <TestimonialsSection />
    </main>
  );
};

export default Index;
