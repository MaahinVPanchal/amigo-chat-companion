import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

const VoiceWidget = () => {
  const [isActive, setIsActive] = useState(false);

  const bars = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Waveform Visualization */}
      <div className="flex items-center justify-center gap-1 h-20">
        {bars.map((i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-lavender rounded-full"
            animate={isActive ? {
              height: [12, 40 + Math.random() * 30, 12],
            } : {
              height: 12,
            }}
            transition={{
              duration: 0.8,
              repeat: isActive ? Infinity : 0,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
            style={{
              height: 12,
            }}
          />
        ))}
      </div>

      {/* Status */}
      <p className="text-zinc-400 text-sm font-medium">
        {isActive ? "Listening..." : "Ready to practice"}
      </p>

      {/* Mic Button */}
      <motion.button
        onClick={() => setIsActive(!isActive)}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
          isActive 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-lavender hover:bg-lavender-glow"
        }`}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        {isActive ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-foreground" />
        )}
      </motion.button>
    </div>
  );
};

export default VoiceWidget;
