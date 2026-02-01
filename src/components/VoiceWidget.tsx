import { useState, useCallback, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { motion } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const VoiceWidget = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const conversation = useConversation({
    onConnect: () => console.log("Connected to Amigo"),
    onDisconnect: () => console.log("Disconnected from Amigo"),
    onError: (error) => console.error("Error:", error),
  });

  const isActive = conversation.status === "connected";
  const bars = [0, 1, 2, 3, 4, 5, 6];

  const startConversation = useCallback(async () => {
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: "agent_6001kfn5vs1jem7r14ppajm8zz3j",
        connectionType: "webrtc",
        // Pass user ID as dynamic variable
        dynamicVariables: {
          user_id: userId
        }
      } as any);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, userId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleToggle = () => {
    if (isActive) {
      stopConversation();
    } else {
      startConversation();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Waveform Visualization */}
      <div className="flex items-center justify-center gap-1 h-20">
        {bars.map((i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-white/80 rounded-full"
            animate={isActive || conversation.isSpeaking ? {
              height: [12, 40 + Math.random() * 30, 12],
            } : {
              height: 12,
            }}
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              repeat: isActive ? Infinity : 0,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
            style={{
              height: 12,
            }}
          />
        ))}
      </div>

      {/* Status */}
      <p className="text-white/70 text-sm font-medium">
        {isConnecting 
          ? "Connecting..." 
          : isActive 
            ? conversation.isSpeaking 
              ? "Amigo is speaking..." 
              : "Listening..." 
            : "Tap to start interview"
        }
      </p>

      {/* Mic Button */}
      <motion.button
        onClick={handleToggle}
        disabled={isConnecting}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg ${
          isActive 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-white/90 hover:bg-white"
        }`}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        {isConnecting ? (
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        ) : isActive ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-primary" />
        )}
      </motion.button>
    </div>
  );
};

export default VoiceWidget;
