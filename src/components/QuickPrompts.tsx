import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

const prompts = [
  "How are you feeling today?",
  "What should I text my partner?",
  "Help me plan a surprise?",
];

export const QuickPrompts = ({ onPromptSelect }: QuickPromptsProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const handleScreenChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isSmall = e.matches;
      setIsSmallScreen(isSmall);
      setShowPrompts(true); // Show again on resize

      // Hide prompts after timeout on all screen sizes
      const timeout = setTimeout(
        () => setShowPrompts(false),
        isSmall ? 5000 : 10000
      );
      return () => clearTimeout(timeout);
    };

    handleScreenChange(mediaQuery); // Initial check
    mediaQuery.addEventListener("change", handleScreenChange);
    const timeout = setTimeout(
      () => setShowPrompts(false),
      isSmallScreen ? 5000 : 10000
    );

    return () => {
      clearTimeout(timeout);
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  const displayPrompts = isSmallScreen ? prompts.slice(0, 2) : prompts;

  if (!showPrompts) return null;

  return (
    <div className="flex items-center flex-wrap gap-2 px-4 py-2">
      <AnimatePresence>
        <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
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
            <div
              className="text-xs px-3 py-1 rounded-md border cursor-pointer bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-400 dark:hover:bg-pink-900/40 transition-colors"
              onClick={() => onPromptSelect(prompt)}
            >
              {prompt}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
