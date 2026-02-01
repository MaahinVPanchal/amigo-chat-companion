import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PhoneMockup from "./PhoneMockup";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column - Text Content */}
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-hero text-foreground">
              MEET
            </h1>
            <h1 className="text-hero-accent text-foreground">
              AMIGO.
            </h1>

            <motion.p 
              className="mt-8 text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Don't face the hiring manager alone. Practice with Amigo—the AI recruiter living in your phone.
            </motion.p>

            <motion.div 
              className="mt-10 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base font-semibold group"
              >
                Start Interview
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="rounded-full px-8 py-6 text-base"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Trust Badge */}
            <motion.div 
              className="mt-12 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">10,000+</span> interviews practiced
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Phone */}
          <div className="flex items-center justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
