import { motion } from "framer-motion";
import { BookOpen, Brain, Users, Zap } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">About Amigo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered interview companion designed to boost your confidence and land your dream job
            </p>
          </motion.div>

          {/* Tablet Book Design */}
          <motion.div 
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Tablet Frame */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl">
              {/* Screen */}
              <div className="bg-white dark:bg-gray-100 rounded-2xl p-8 shadow-inner">
                {/* Book Pages */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Page */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-8 h-8 text-purple-600" />
                      <h3 className="text-2xl font-bold text-gray-800">Our Story</h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700">
                      <p className="leading-relaxed">
                        Amigo was born from a simple observation: job interviews are stressful, 
                        and practice makes perfect. We created an AI companion that understands 
                        the nuances of modern hiring processes.
                      </p>
                      
                      <p className="leading-relaxed">
                        Our mission is to democratize interview preparation, making it accessible 
                        to everyone, regardless of their background or experience level.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <Users className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-gray-800">10,000+ Success Stories</span>
                    </div>
                  </div>

                  {/* Right Page */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Brain className="w-8 h-8 text-blue-600" />
                      <h3 className="text-2xl font-bold text-gray-800">What Makes Us Different</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-800">AI-Powered Insights</h4>
                          <p className="text-sm text-gray-600">
                            Advanced AI analyzes your responses and provides personalized feedback
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-800">Real-World Scenarios</h4>
                          <p className="text-sm text-gray-600">
                            Practice with questions from actual hiring managers and recruiters
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-800">Continuous Learning</h4>
                          <p className="text-sm text-gray-600">
                            Amigo learns from each session to provide better, more targeted practice
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      "Don't face the hiring manager alone"
                    </p>
                    <p className="text-gray-600">
                      Join thousands of professionals who've transformed their interview skills with Amigo
                    </p>
                  </div>
                </div>
              </div>

              {/* Tablet Details */}
              <div className="flex justify-center mt-4">
                <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-80"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;