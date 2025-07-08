import { Message } from "@/store/chatStore";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex items-center justify-center w-full mb-4 animate-fade-in",
        // On large screens: center all messages
        "lg:justify-center",
        // On small screens: user right, assistant left
        isUser ? "justify-end lg:justify-end" : "justify-start lg:justify-start"
      )}
    >
      <div
        className={cn(
          "w-fit max-w-[90%] md:max-w-[70%] lg:max-w-[50%] break-words rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-md"
            : "bg-white border border-pink-100 text-gray-800 rounded-bl-md dark:bg-gray-800 dark:border-pink-800 dark:text-white"
        )}
      >
        {message.image && (
          <img
            src={message.image}
            alt="Shared image"
            className="w-full max-w-full sm:max-w-sm rounded-lg mb-2"
          />
        )}
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
        <div
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-pink-100" : "text-gray-500"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
