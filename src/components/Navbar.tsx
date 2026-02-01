import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useStats } from "@/hooks/useStats";
import { LogOut, User, Star, Users, FileText } from "lucide-react";
import ReviewModal from "./ReviewModal";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { stats } = useStats();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleReviewClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewAdded = () => {
    // Trigger a page refresh to show new testimonial
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Amigo</span>
          </div>

          {/* Nav Links & Stats */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About us
            </a>
            <button 
              onClick={handleReviewClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Star className="w-4 h-4" />
              Reviews
            </button>
            
            {/* Stats Display */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{stats.totalUsers.toLocaleString()} users</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{stats.totalDocuments.toLocaleString()} docs</span>
              </div>
              {stats.totalReviews > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{stats.averageRating}/5 ({stats.totalReviews})</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full px-4"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleReviewClick}
                  className="md:hidden"
                >
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewAdded={handleReviewAdded}
      />
    </>
  );
};

export default Navbar;
