
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { questions } from '@/data/questions';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultsPageProps {
  answers: boolean[];
  onRestart: () => void;
}

// Define our personality types
const personalityTypes = {
  boomerOnline: {
    name: "CHRONICALLY ONLINE BOOMER",
    description: "You argue about politics in Facebook comments and forward chain emails. You know how to post angry face emojis but can't figure out how to rotate a PDF.",
    emoji: "👴📱"
  },
  boomerCaveman: {
    name: "CAVEMAN BOOMER",
    description: "You distrust all technology and prefer doing things 'the old fashioned way.' You have an actual phonebook and can fix anything with duct tape.",
    emoji: "👵🔨"
  },
  genZOnline: {
    name: "CHRONICALLY ONLINE GEN-Z",
    description: "Your screen time is measured in days, not hours. You have strong opinions about fandoms and know all the latest TikTok trends.",
    emoji: "🧑‍💻💅"
  },
  genZCaveman: {
    name: "CAVEMAN GEN-Z",
    description: "You own a record player 'for the sound quality' and grow your own vegetables. You're into 'digital detoxing' but still post about it.",
    emoji: "👱‍♀️🌱"
  }
};

const ResultsPage: React.FC<ResultsPageProps> = ({ answers, onRestart }) => {
  const isMobile = useIsMobile();
  const [dimension1Score, setDimension1Score] = useState(0); // Boomer vs Gen-Z
  const [dimension2Score, setDimension2Score] = useState(0); // Caveman vs Online
  const [personalityType, setPersonalityType] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [llmOutput, setLlmOutput] = useState('');

  useEffect(() => {
    // Calculate scores based on answers
    let d1Score = 0;
    let d2Score = 0;

    answers.forEach((answer, index) => {
      if (answer) {
        d1Score += questions[index].dimension1Value;
        d2Score += questions[index].dimension2Value;
      }
    });

    // Normalize scores to a -10 to 10 scale
    const totalPossibleD1 = questions.reduce((acc, q) => acc + Math.abs(q.dimension1Value), 0);
    const totalPossibleD2 = questions.reduce((acc, q) => acc + Math.abs(q.dimension2Value), 0);
    
    const normalizedD1 = (d1Score / totalPossibleD1) * 20 - 10;
    const normalizedD2 = (d2Score / totalPossibleD2) * 20 - 10;

    setDimension1Score(normalizedD1);
    setDimension2Score(normalizedD2);

    // Determine personality type
    let type;
    if (normalizedD1 >= 0) { // Gen Z
      if (normalizedD2 >= 0) {
        type = 'genZOnline';
      } else {
        type = 'genZCaveman';
      }
    } else { // Boomer
      if (normalizedD2 >= 0) {
        type = 'boomerOnline';
      } else {
        type = 'boomerCaveman';
      }
    }

    setPersonalityType(personalityTypes[type].name);
    setDescription(personalityTypes[type].description);
    setEmoji(personalityTypes[type].emoji);

    // Simulate "LLM processing" for nostalgic loading effect
    setTimeout(() => {
      setIsLoading(false);
      setLlmOutput(generateFakeAnalysis(type));
    }, 3000);
  }, [answers]);

  // Generate a fake LLM analysis based on the personality type
  const generateFakeAnalysis = (type: string) => {
    const analyses = {
      boomerOnline: "Based on your responses, I detect a fascinating pattern! You seem comfortable with technology but in a way that's distinctly from an earlier era. You've adapted to digital life but haven't fully embraced its culture. The data suggests you're excellent at finding and sharing content but perhaps not always discerning about its accuracy. Recommendation: Try exploring newer platforms with a healthy skepticism!",
      boomerCaveman: "Analyzing your responses reveals someone who values tradition and hands-on approaches! The algorithm detects a strong preference for physical solutions over digital ones. Your data pattern suggests excellent practical skills but potential resistance to beneficial innovations. Recommendation: Consider how selective technology adoption might enhance your already strong self-sufficiency!",
      genZOnline: "Your response pattern is fascinating! The algorithm detects extremely high digital native behaviors with significant immersion in online culture. Your digital footprint suggests you process information rapidly but perhaps with reduced depth. Recommendation: Consider occasional digital detoxes to allow for deeper thinking patterns to develop alongside your impressive content creation skills!",
      genZCaveman: "What an interesting contradiction in your data! You show patterns typical of digital natives but with a deliberate rejection of hyperconsumption. The algorithm suggests you're selectively adapting technology rather than embracing it wholesale. Recommendation: Your balanced approach is rare - consider documenting your selective adoption practices to help others find similar balance!"
    };
    
    return analyses[type];
  };

  // Calculate position on the chart
  const chartSize = isMobile ? 250 : 300; // Smaller chart on mobile
  const dotX = (dimension1Score + 10) * (chartSize / 20); // Convert from -10/10 to 0/300px
  const dotY = (10 - dimension2Score) * (chartSize / 20); // Note Y is inverted in CSS

  return (
    <motion.div 
      className="min-h-screen py-4 px-2 md:py-8 md:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="y2k-container max-w-3xl mx-auto">
        <h1 className="y2k-title text-2xl md:text-4xl lg:text-6xl mb-4 md:mb-8">
          <span className="text-shadow-y2k">YOUR RESULTS!</span>
        </h1>
        
        <div className="bg-white/70 rounded-lg p-3 md:p-4 mb-4 md:mb-6 font-comic text-center border-4 border-dashed border-y2k-red">
          {isLoading ? (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-pixel text-y2k-blue mb-4">ANALYZING YOUR SOUL...</h2>
              <div className="flex justify-center">
                <div className="w-4 h-4 md:w-6 md:h-6 bg-y2k-lime rounded-full mx-1 animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-4 h-4 md:w-6 md:h-6 bg-y2k-hotpink rounded-full mx-1 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-4 h-4 md:w-6 md:h-6 bg-y2k-blue rounded-full mx-1 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
              <p className="mt-4 text-sm md:text-base text-y2k-purple font-comic">
                Our Y2K-compatible AI is deeply examining your psyche...
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl md:text-3xl font-pixel text-y2k-purple mb-2 animate-wiggle break-words px-1">
                {emoji} {personalityType} {emoji}
              </h2>
              <p className="text-y2k-blue text-sm md:text-lg mb-4 md:mb-6 font-bold px-1">
                {description}
              </p>
              
              {/* Personality Chart - Responsive version */}
              <div className="relative mx-auto my-6 md:my-8" style={{ width: `${chartSize}px`, height: `${chartSize}px` }}>
                <div className="absolute inset-0 bg-white/90 border-4 border-y2k-hotpink rounded-lg">
                  {/* Vertical line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-y2k-blue"></div>
                  {/* Horizontal line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-y2k-blue"></div>
                  
                  {/* Labels - Adjusted for mobile */}
                  <div className="absolute top-1 md:top-2 left-1/2 transform -translate-x-1/2 text-y2k-blue font-pixel text-[8px] md:text-xs">ONLINE</div>
                  <div className="absolute bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 text-y2k-blue font-pixel text-[8px] md:text-xs">CAVEMAN</div>
                  <div className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 text-y2k-blue font-pixel text-[8px] md:text-xs">BOOMER</div>
                  <div className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 text-y2k-blue font-pixel text-[8px] md:text-xs">GEN-Z</div>
                  
                  {/* Quadrant Labels - Smaller on mobile */}
                  <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-y2k-purple font-comic text-[7px] md:text-xs text-center">
                    👴📱<br />{!isMobile && "Chronically"}<br />Online<br />Boomer
                  </div>
                  <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 text-y2k-purple font-comic text-[7px] md:text-xs text-center">
                    🧑‍💻💅<br />{!isMobile && "Chronically"}<br />Online<br />Gen-Z
                  </div>
                  <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 text-y2k-purple font-comic text-[7px] md:text-xs text-center">
                    👵🔨<br />Caveman<br />Boomer
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 text-y2k-purple font-comic text-[7px] md:text-xs text-center">
                    👱‍♀️🌱<br />Caveman<br />Gen-Z
                  </div>
                  
                  {/* The dot showing the user's position */}
                  <motion.div 
                    className="absolute w-6 h-6 md:w-8 md:h-8 bg-y2k-hotpink rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm md:text-lg"
                    style={{ left: `${dotX}px`, top: `${dotY}px` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2, x: isMobile ? -12 : -16, y: isMobile ? -12 : -16 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.5
                    }}
                  >
                    👆
                  </motion.div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-6 bg-y2k-blue/20 p-3 md:p-4 rounded-lg border-2 border-y2k-purple">
                <h3 className="text-base md:text-lg font-pixel text-y2k-purple mb-2">AI ANALYSIS:</h3>
                <p className="text-y2k-blue font-comic text-xs md:text-sm">{llmOutput}</p>
              </div>
            </div>
          )}
        </div>
        
        <motion.div 
          className="mt-6 md:mt-8 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button 
            onClick={onRestart} 
            className="y2k-button text-lg md:text-2xl px-6 py-3 md:px-8 md:py-4 text-white uppercase font-bold"
          >
            {">>>"} TRY AGAIN {"<<<"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;
