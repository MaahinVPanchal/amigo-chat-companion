import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceWidget from "./VoiceWidget";
import { Mic, X } from "lucide-react";

const PhoneMockup = () => {
  const [isAppOpen, setIsAppOpen] = useState(false);

  return (
    <div className="relative">
      {/* Purple Blob Background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-lavender animate-blob opacity-80"
        style={{
          filter: 'blur(60px)',
        }}
      />

      {/* Phone Container */}
      <motion.div 
        className="relative z-10 animate-float"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Phone Frame */}
        <div className="relative w-[280px] h-[570px] md:w-[320px] md:h-[650px]">
          {/* Phone outer shell */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-[3rem] shadow-2xl">
            {/* Phone inner bezel */}
            <div className="absolute inset-[3px] bg-zinc-900 rounded-[2.8rem]">
              {/* Screen */}
              <div className="absolute inset-[8px] rounded-[2.4rem] overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-20" />
                
                <AnimatePresence mode="wait">
                  {!isAppOpen ? (
                    /* iOS Home Screen */
                    <motion.div
                      key="homescreen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative w-full h-full"
                    >
                      {/* Wallpaper - Space Black image */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "url('/SpaceBlack.png')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      
                      {/* Status Bar */}
                      <div className="absolute top-3 left-0 right-0 flex justify-between items-center px-8 z-10">
                        <span className="text-white text-xs font-medium">9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            <div className="w-1 h-2.5 bg-white rounded-sm" />
                            <div className="w-1 h-3 bg-white rounded-sm" />
                            <div className="w-1 h-3.5 bg-white rounded-sm" />
                            <div className="w-1 h-4 bg-white rounded-sm" />
                          </div>
                          <div className="w-6 h-3 border border-white rounded-sm ml-1">
                            <div className="w-4 h-2 bg-white rounded-sm m-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* App Grid */}
                      <div className="absolute inset-0 pt-16 px-4 pb-20">
                        <div className="flex justify-center mt-20">
                          <div className="grid grid-cols-2 gap-8">
                            {/* Amigo App - Main CTA */}
                            <motion.button
                              onClick={() => setIsAppOpen(true)}
                              className="flex flex-col items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <motion.div 
                                className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-lavender to-purple-400 flex items-center justify-center shadow-xl"
                                whileHover={{ 
                                  scale: 1.1,
                                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              >
                                <Mic className="w-8 h-8 md:w-9 md:h-9 text-white" />
                              </motion.div>
                              <span className="text-white text-xs font-medium">Amigo</span>
                            </motion.button>

                            {/* Weather App */}
                            <motion.button
                              className="flex flex-col items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <motion.div 
                                className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-xl"
                                whileHover={{ 
                                  scale: 1.1,
                                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              >
                                <span className="text-2xl">☀️</span>
                              </motion.div>
                              <span className="text-white text-xs font-medium">Weather</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Home Indicator */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full" />
                    </motion.div>
                  ) : (
                    /* Amigo App Screen */
                    <motion.div
                      key="amigoapp"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative w-full h-full overflow-hidden"
                    >
                      {/* Solar Gradient Wallpaper */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "url('/SolarGradient11.png')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />

                      {/* Close Button */}
                      <button
                        onClick={() => setIsAppOpen(false)}
                        className="absolute top-12 right-4 z-30 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>

                      {/* Screen Content */}
                      <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
                        {/* Status text */}
                        <div className="absolute top-14 left-0 right-0 text-center">
                          <p className="text-white/70 text-xs font-medium tracking-wider uppercase">
                            AI Interview
                          </p>
                          <p className="text-white text-lg font-semibold mt-1">
                            Amigo
                          </p>
                        </div>

                        {/* Voice Widget */}
                        <VoiceWidget />

                        {/* Bottom hint */}
                        <div className="absolute bottom-8 left-0 right-0 text-center">
                          <p className="text-white/70 text-xs">
                            Tap to start your interview
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Side buttons */}
          <div className="absolute left-[-2px] top-[120px] w-[3px] h-[30px] bg-zinc-700 rounded-l-sm" />
          <div className="absolute left-[-2px] top-[170px] w-[3px] h-[50px] bg-zinc-700 rounded-l-sm" />
          <div className="absolute left-[-2px] top-[230px] w-[3px] h-[50px] bg-zinc-700 rounded-l-sm" />
          <div className="absolute right-[-2px] top-[150px] w-[3px] h-[80px] bg-zinc-700 rounded-r-sm" />
        </div>
      </motion.div>
    </div>
  );
};

export default PhoneMockup;
