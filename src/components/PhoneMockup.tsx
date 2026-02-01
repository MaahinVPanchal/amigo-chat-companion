import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceWidget from "./VoiceWidget";
import DocumentsApp from "./DocumentsApp";
import { Mic, X, ArrowLeft, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthScreenProps {
  onSuccess: () => void;
  onBack: () => void;
  isInterviewMode?: boolean;
}

const AuthScreen = ({ onSuccess, onBack, isInterviewMode }: AuthScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Account created successfully! You can now sign in.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="authscreen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/Apple1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-600/80 to-blue-500/80" />
      
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

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-12 left-4 z-30 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
      >
        <ArrowLeft className="w-4 h-4 text-white" />
      </button>

      {/* Auth Form */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        <div className="w-full max-w-[240px]">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-bold mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-white/70 text-sm">
              {isSignUp ? "Join Amigo today" : "Sign in to continue"}
            </p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm h-10"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm h-10"
                placeholder="Enter your password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-white text-purple-900 hover:bg-white/90 h-10 text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/80 hover:text-white text-sm underline"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full" />
    </motion.div>
  );
};

interface PhoneMockupProps {
  isInterviewMode?: boolean;
  onBackToHome?: () => void;
}

const PhoneMockup = ({ isInterviewMode = false, onBackToHome }: PhoneMockupProps) => {
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [showDocumentsApp, setShowDocumentsApp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_IN') {
        setShowAuthScreen(false);
        setIsAppOpen(true);
        toast({
          title: "Welcome!",
          description: "You're now signed in to Amigo.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  // Handle interview mode
  useEffect(() => {
    if (isInterviewMode) {
      if (isAuthenticated) {
        setIsAppOpen(true);
      } else {
        setShowAuthScreen(true);
      }
    } else {
      setIsAppOpen(false);
      setShowAuthScreen(false);
    }
  }, [isInterviewMode, isAuthenticated]);

  const handleAmigoAppClick = () => {
    if (isAuthenticated) {
      setIsAppOpen(true);
    } else {
      setShowAuthScreen(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthScreen(false);
    setIsAppOpen(true);
  };

  const handleDocumentsAppClick = () => {
    if (isAuthenticated) {
      setShowDocumentsApp(true);
    } else {
      setShowAuthScreen(true);
    }
  };

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
                  {showDocumentsApp ? (
                    /* Documents App */
                    <DocumentsApp onBack={() => setShowDocumentsApp(false)} />
                  ) : showAuthScreen ? (
                    /* Authentication Screen */
                    <AuthScreen 
                      onSuccess={handleAuthSuccess} 
                      onBack={isInterviewMode ? onBackToHome || (() => setShowAuthScreen(false)) : () => setShowAuthScreen(false)}
                      isInterviewMode={isInterviewMode}
                    />
                  ) : !isAppOpen ? (
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
                          backgroundImage: "url('/Apple1.jpg')",
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
                      <div className="absolute inset-0 pt-8 px-4 pb-20">
                        <div className="flex justify-center mt-20">
                          <div className="grid grid-cols-2 gap-8">
                            {/* Amigo App - Main CTA */}
                            <motion.button
                              onClick={handleAmigoAppClick}
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

                            {/* Documents App */}
                            <motion.button
                              onClick={handleDocumentsAppClick}
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
                                <FileText className="w-8 h-8 md:w-9 md:h-9 text-white" />
                              </motion.div>
                              <span className="text-white text-xs font-medium">Documents</span>
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
                        onClick={() => {
                          if (isInterviewMode && onBackToHome) {
                            onBackToHome();
                          } else {
                            setIsAppOpen(false);
                          }
                        }}
                        className="absolute top-12 right-4 z-30 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>

                      {/* Avatar at top */}
                      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                          <img 
                            src="/amigo-avatar.png" 
                            alt="Amigo" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-white text-center text-sm font-semibold mt-2">Amigo</p>
                      </div>

                      {/* Screen Content */}
                      <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
                        {/* Voice Widget */}
                        <VoiceWidget />
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
