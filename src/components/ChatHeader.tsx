import { Button } from "@/components/ui/button";
import { MoodSelector } from "./MoodSelector";
import { ChatMood } from "@/store/chatStore";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface ChatHeaderProps {
  currentMood: ChatMood;
  onMoodChange: (mood: ChatMood) => void;
  onSidebarToggle: () => void;
}

export const ChatHeader = ({
  currentMood,
  onMoodChange,
  onSidebarToggle,
}: ChatHeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-pink-100 shadow-sm">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          className="hidden md:flex dark:bg-gray-600"
        >
          <Menu className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <div>
            <h3 className="font-semibold text-gray-800">Dateme.ai</h3>
            <div className="text-xs text-green-500 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Online
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <MoodSelector currentMood={currentMood} onMoodChange={onMoodChange} />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hidden sm:flex dark:bg-gray-600"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
