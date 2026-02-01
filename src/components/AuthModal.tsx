import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
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

        toast({ title: "Welcome back 👋" });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !loading) onClose();
      }}
    >
      <DialogContent
        className="
          relative w-[90vw] max-w-sm p-0 overflow-hidden
          rounded-2xl border border-black/5
          bg-white/80 backdrop-blur-xl
          shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)]
          [&>button]:hidden
        "
      >
        {/* Subtle wallpaper */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(/Wallpaper1.png)" }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 py-8">
          <DialogTitle className="sr-only">
            {isSignUp ? "Create account" : "Sign in"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isSignUp
              ? "One account. All experiences."
              : "Welcome back."}
          </DialogDescription>
          
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            {isSignUp ? "Create account" : "Sign in"}
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1">
            {isSignUp
              ? "One account. All experiences."
              : "Welcome back."}
          </p>

          <form onSubmit={handleAuth} className="mt-6 space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@icloud.com"
                className="
                  h-11 rounded-xl
                  bg-gray-100/70
                  border-none
                  focus:ring-2 focus:ring-black/10
                "
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="
                  h-11 rounded-xl
                  bg-gray-100/70
                  border-none
                  focus:ring-2 focus:ring-black/10
                "
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="
                w-full h-11 rounded-xl
                bg-black text-white
                hover:bg-black/90
                transition
              "
            >
              {loading
                ? "Please wait…"
                : isSignUp
                ? "Create account"
                : "Continue"}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="
                text-sm text-gray-500
                hover:text-black transition
                disabled:opacity-50
              "
            >
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}
              <span className="ml-1 font-medium underline">
                {isSignUp ? "Sign in" : "Create one"}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;