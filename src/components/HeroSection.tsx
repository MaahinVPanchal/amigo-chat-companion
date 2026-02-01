import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PhoneMockup from "./PhoneMockup";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useStats } from "@/hooks/useStats";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [isPhoneCentered, setIsPhoneCentered] = useState(false);
  const { stats } = useStats();
  const { toast } = useToast();

  const handleStartInterview = () => {
    // Always center the phone - authentication will be handled inside the phonebook
    setIsPhoneCentered(true);
    toast({
      title: "Starting Interview",
      description: "Welcome to your interview practice session!",
    });
  };

  const handleBackToHome = () => {
    setIsPhoneCentered(false);
  };

  return (
    <>
      <section className="min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden relative">
        {/* Background with wallpaper */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: 'url(/Wallpaper.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-600 to-blue-500 opacity-20" />
        </div>

        {/* Overlay when phone is centered */}
        {isPhoneCentered && (
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            className={`transition-all duration-1000 ease-in-out ${
              isPhoneCentered 
                ? 'flex items-center justify-center min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-8rem)]' 
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-8rem)]'
            }`}
            layout
          >
            {/* Left Column - Text Content */}
            <motion.div 
              className={`flex flex-col justify-center transition-all duration-1000 text-center md:text-left ${
                isPhoneCentered ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'
              }`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ 
                opacity: isPhoneCentered ? 0 : 1, 
                x: isPhoneCentered ? -100 : 0 
              }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-hero text-foreground">
                MEET
              </h1>
              <h1 className="text-hero-accent text-foreground">
                AMIGO.
              </h1>

              <motion.p 
                className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Don't face the hiring manager alone. Practice with Amigo—the AI recruiter living in your phone.
              </motion.p>

              <motion.div 
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button 
                  size="lg" 
                  className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold group w-full sm:w-auto"
                  onClick={handleStartInterview}
                >
                  Start Interview
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base w-full sm:w-auto"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </motion.div>

              {/* Trust Badge */}
              <motion.div 
                className="mt-8 sm:mt-12 flex items-center justify-center md:justify-start gap-3 sm:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="flex -space-x-2">
                  {/* Show real user count as avatars */}
                  {Array.from({ length: Math.min(4, Math.ceil(stats.totalUsers / 300)) }, (_, i) => (
                    <div 
                      key={i} 
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 border-2 border-background flex items-center justify-center text-xs font-medium text-white shadow-sm"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {stats.totalUsers > 1200 && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-background flex items-center justify-center text-xs font-medium text-white shadow-sm">
                      +
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {stats.interviewsPracticed.toLocaleString()}+
                    </span> interviews practiced
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    by <span className="font-medium">{stats.totalUsers.toLocaleString()}+</span> professionals
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Phone */}
            <motion.div 
              className={`flex items-center justify-center transition-all duration-1000 relative ${
                isPhoneCentered 
                  ? 'scale-110 sm:scale-125 md:scale-110' 
                  : 'md:justify-end scale-100'
              }`}
              animate={{
                scale: isPhoneCentered ? 1.1 : 1,
                x: isPhoneCentered ? 0 : 0
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              {/* Back Button Overlay - Only show when phone is centered */}
              {isPhoneCentered && (
                <motion.div
                  className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 z-50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <button
                    onClick={handleBackToHome}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg text-xs sm:text-sm"
                  >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                    <span className="font-medium">Back to Home</span>
                  </button>
                </motion.div>
              )}
              
              <PhoneMockup 
                isInterviewMode={isPhoneCentered}
                onBackToHome={handleBackToHome}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
