import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, X, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: () => void;
}

const ReviewModal = ({ isOpen, onClose, onReviewAdded }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Rating, 2: Review Text, 3: Name
  const { user } = useAuth();
  const { toast } = useToast();

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          user_email: user.email,
          user_name: userName || user.email?.split('@')[0] || 'Anonymous',
          rating,
          review_text: reviewText,
        });

      if (error) throw error;

      toast({
        title: "Review Submitted! ✨",
        description: "Thank you for sharing your experience.",
      });

      // Reset form
      setRating(0);
      setReviewText("");
      setUserName("");
      setStep(1);
      onReviewAdded();
      onClose();
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

  const nextStep = () => {
    if (step === 1 && rating > 0) setStep(2);
    else if (step === 2 && reviewText.trim()) setStep(3);
    else if (step === 3) handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.3 
              }}
              className="relative bg-white/95 backdrop-blur-2xl rounded-[28px] shadow-2xl border border-white/30 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
              }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-300/20 to-blue-400/20 animate-pulse" />
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-400/30 to-transparent rounded-full blur-3xl" />
              </div>
              
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4 text-gray-600" />
              </motion.button>

              <div className="relative z-10 p-8">
                {/* Progress Indicator */}
                <div className="flex justify-center mb-6">
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i <= step ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                        animate={{ scale: i === step ? 1.2 : 1 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Step 1: Rating */}
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                      >
                        <div className="flex justify-center mb-4">
                          <Sparkles className="w-8 h-8 text-purple-500" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                          How was your experience?
                        </h2>
                        <p className="text-gray-600">
                          Your feedback helps us improve Amigo
                        </p>
                      </motion.div>

                      <div className="space-y-6">
                        <div className="flex justify-center gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              className="p-2 rounded-2xl hover:bg-gray-100/50 transition-all duration-200"
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setRating(star)}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Star
                                className={`w-12 h-12 transition-all duration-300 ${
                                  star <= (hoveredRating || rating)
                                    ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                                    : "text-gray-300"
                                }`}
                              />
                            </motion.button>
                          ))}
                        </div>

                        {(hoveredRating || rating) > 0 && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg font-medium text-gray-700"
                          >
                            {ratingLabels[hoveredRating || rating]}
                          </motion.p>
                        )}

                        {rating > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Button 
                              onClick={nextStep}
                              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl py-4 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Continue
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Review Text */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                          Tell us more
                        </h2>
                        <p className="text-gray-600">
                          Share your experience with other users
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="relative">
                          <Textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="bg-gray-50/50 border-gray-200/50 focus:border-purple-300 focus:ring-purple-200/50 rounded-2xl min-h-[140px] resize-none text-gray-700 placeholder:text-gray-400"
                            placeholder="What did you like most about Amigo? How did it help you prepare for interviews?"
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {reviewText.length}/500
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={prevStep}
                            variant="outline"
                            className="flex-1 rounded-2xl py-3 border-gray-200 hover:bg-gray-50"
                          >
                            Back
                          </Button>
                          <Button 
                            onClick={nextStep}
                            disabled={!reviewText.trim()}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Name & Submit */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                          Almost done!
                        </h2>
                        <p className="text-gray-600">
                          How should we display your name?
                        </p>
                      </div>

                      <div className="space-y-6">
                        <Input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="bg-gray-50/50 border-gray-200/50 focus:border-purple-300 focus:ring-purple-200/50 rounded-2xl py-4 text-gray-700"
                          placeholder="Your name (optional)"
                        />

                        <div className="flex gap-3">
                          <Button 
                            onClick={prevStep}
                            variant="outline"
                            className="flex-1 rounded-2xl py-3 border-gray-200 hover:bg-gray-50"
                          >
                            Back
                          </Button>
                          <Button 
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                              </div>
                            ) : (
                              "Submit Review ✨"
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;