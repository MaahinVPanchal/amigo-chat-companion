import { motion } from "framer-motion";
import VoiceWidget from "./VoiceWidget";

const PhoneMockup = () => {
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
              <div className="absolute inset-[8px] bg-phone-bg rounded-[2.4rem] overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-zinc-900 rounded-full z-20" />
                
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
