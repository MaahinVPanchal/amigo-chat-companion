import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PhoneMockup from "./PhoneMockup";
import AuthModal from "./AuthModal";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPhoneCentered, setIsPhoneCentered] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartInterview = () => {
    if (user) {
      // User is already authenticated, center the phone and start the interview
      setIsPhoneCentered(true);
      toast({
        title: "Starting Interview",
        description: "Welcome to your interview practice session!",
      });
    } else {
      // User needs to authenticate first, but still center the phone
      setIsPhoneCentered(true);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    toast({
      title: "Authentication Successful",
      description: "You can now start your interview practice!",
    });
  };

  const handleBackToHome = () => {
    setIsPhoneCentered(false);
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <section className="min-h-screen pt-24 pb-12 overflow-hidden relative">
        {/* Background with wallpaper */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: 'url(/Wallpaper1.png)' }}
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
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className={`transition-all duration-1000 ease-in-out ${
              isPhoneCentered 
                ? 'flex items-center justify-center min-h-[calc(100vh-8rem)]' 
                : 'grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-8rem)]'
            }`}
            layout
          >
            {/* Left Column - Text Content */}
            <motion.div 
              className={`flex flex-col justify-center transition-all duration-1000 ${
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
                  onClick={handleStartInterview}
                >
                  {user ? "Start Interview" : "Start Interview"}
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
            <motion.div 
              className={`flex items-center justify-center transition-all duration-1000 relative ${
                isPhoneCentered ? 'scale-110' : 'lg:justify-end scale-100'
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
                  className="absolute -top-20 left-1/2 -translate-x-1/2 z-50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <button
                    onClick={handleBackToHome}
                    className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span className="text-sm font-medium">Back to Home</span>
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

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default HeroSection;
