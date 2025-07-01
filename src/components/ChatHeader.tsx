
import { Button } from '@/components/ui/button';
import { MoodSelector } from './MoodSelector';
import { ChatMood } from '@/store/chatStore';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ChatHeaderProps {
  currentMood: ChatMood;
  onMoodChange: (mood: ChatMood) => void;
  onSidebarToggle: () => void;
}

export const ChatHeader = ({ currentMood, onMoodChange, onSidebarToggle }: ChatHeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-pink-100 shadow-sm">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="hidden md:flex">
          <Menu className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Dating Assistant</h3>
            <p className="text-xs text-green-500 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Online
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <MoodSelector currentMood={currentMood} onMoodChange={onMoodChange} />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hidden sm:flex"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
