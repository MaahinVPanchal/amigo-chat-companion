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
                      {/* Wallpaper - Purple gradient like reference */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-600 to-blue-500" />
                      
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
                        <div className="grid grid-cols-4 gap-4 mt-8">
                          {/* Amigo App - Main CTA */}
                          <motion.button
                            onClick={() => setIsAppOpen(true)}
                            className="flex flex-col items-center gap-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-lavender to-purple-400 flex items-center justify-center shadow-lg">
                              <Mic className="w-7 h-7 md:w-8 md:h-8 text-white" />
                            </div>
                            <span className="text-white text-[10px] font-medium">Amigo</span>
                          </motion.button>

                          {/* Placeholder Apps */}
                          {[
                            { color: "from-blue-400 to-blue-600", icon: "📞" },
                            { color: "from-green-400 to-green-600", icon: "💬" },
                            { color: "from-orange-400 to-red-500", icon: "📷" },
                            { color: "from-pink-400 to-pink-600", icon: "🎵" },
                            { color: "from-blue-500 to-indigo-600", icon: "📧" },
                            { color: "from-gray-600 to-gray-800", icon: "⚙️" },
                          ].map((app, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg opacity-60`}>
                                <span className="text-xl md:text-2xl">{app.icon}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dock */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-2 flex justify-around">
                          {["📱", "🌐", "📁", "🎧"].map((icon, i) => (
                            <div key={i} className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 flex items-center justify-center">
                              <span className="text-lg md:text-xl">{icon}</span>
                            </div>
                          ))}
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
                      className="relative w-full h-full bg-black"
                    >
                      {/* Close Button */}
                      <button
                        onClick={() => setIsAppOpen(false)}
                        className="absolute top-12 right-4 z-30 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-zinc-400" />
                      </button>

                      {/* Screen Content */}
                      <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
                        {/* Status text */}
                        <div className="absolute top-14 left-0 right-0 text-center">
                          <p className="text-zinc-400 text-xs font-medium tracking-wider uppercase">
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
                          <p className="text-zinc-500 text-xs">
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
