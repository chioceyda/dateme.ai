import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

const prompts = [
  "How are you feeling today?",
  "I miss you so much",
  "Tell me something romantic",
  "What should I text my partner?",
  "I'm feeling lonely",
  "Help me plan a surprise",
];

export const QuickPrompts = ({ onPromptSelect }: QuickPromptsProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const updateScreenSize = (e: MediaQueryListEvent | MediaQueryList) => {
      const isSmall = e.matches;
      setIsSmallScreen(isSmall);
      setShowPrompts(true); // Reset prompt visibility

      // If small screen, hide prompts after 5s
      if (isSmall) {
        const timer = setTimeout(() => setShowPrompts(false), 5000);
        return () => clearTimeout(timer);
      }
    };

    updateScreenSize(mediaQuery);
    mediaQuery.addEventListener("change", updateScreenSize);
    return () => mediaQuery.removeEventListener("change", updateScreenSize);
  }, []);

  const displayPrompts = isSmallScreen ? prompts.slice(0, 2) : prompts;

  if (!showPrompts) return null;

  return (
    <div className="flex items-center flex-wrap gap-2 p-4 border-t border-pink-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <AnimatePresence>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Quick prompt:
        </span>
        {displayPrompts.map((prompt, index) => (
          <motion.div
            key={prompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 hover:border-pink-300 dark:bg-pink-900/20 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-900/30"
              onClick={() => onPromptSelect(prompt)}
            >
              {prompt}
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
