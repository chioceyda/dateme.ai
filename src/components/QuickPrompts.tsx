
import { Button } from '@/components/ui/button';

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

const prompts = [
  "How are you feeling today?",
  "I miss you so much",
  "Tell me something romantic",
  "What should I text my partner?",
  "I'm feeling lonely",
  "Help me plan a surprise"
];

export const QuickPrompts = ({ onPromptSelect }: QuickPromptsProps) => {
  // Show only 2 prompts on mobile, all on larger screens
  const displayPrompts = window.innerWidth < 768 ? prompts.slice(0, 2) : prompts;

  return (
    <div className="flex flex-wrap gap-2 p-4 border-t border-pink-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      {displayPrompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 hover:border-pink-300 dark:bg-pink-900/20 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-900/30"
          onClick={() => onPromptSelect(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
};
