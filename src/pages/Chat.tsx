import { useState, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { chatState, Message } from "@/store/chatStore";
import { ChatBubble } from "@/components/ChatBubble";
import { TypingDots } from "@/components/TypingDots";
import { ChatHeader } from "@/components/ChatHeader";
import { Sidebar } from "@/components/Sidebar";
import { QuickPrompts } from "@/components/QuickPrompts";
import { ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { OpenAIService } from "@/utils/openai";
import { conversationService } from "@/services/conversationService";

const Chat = () => {
  const state = useSnapshot(chatState);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use mock service for demo (replace with real API key)
  // const aiService = new MockOpenAIService();
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const aiService = new OpenAIService(apiKey);

  if (!apiKey) {
    console.error(
      "❌ Missing OpenAI API Key! Please check your .env file and restart the dev server."
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
      image: selectedImage || undefined,
      mood: state.userPreferences.mood,
    };

    chatState.messages.push(newMessage);
    chatState.isTyping = true;

    // Save message to conversation
    if (currentConversationId) {
      await conversationService.saveMessage(currentConversationId, newMessage);
    } else {
      // Create new conversation
      const conversationId = await conversationService.createConversation(
        message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        message
      );
      setCurrentConversationId(conversationId);
    }

    setMessage("");
    setSelectedImage("");
    setShowImageUploader(false);

    try {
      const openAIMessages = [
        {
          role: "user" as const,
          content: selectedImage
            ? [
                {
                  type: "text" as const,
                  text: message || "What do you think about this image?",
                },
                {
                  type: "image_url" as const,
                  image_url: {
                    url: selectedImage,
                    detail: "auto" as const,
                  },
                },
              ]
            : message,
        },
      ];

      const response = await aiService.sendMessage(
        openAIMessages,
        state.userPreferences.mood
      );

      chatState.isTyping = false;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "assistant",
        timestamp: new Date(),
        mood: state.userPreferences.mood,
      };

      chatState.messages.push(aiMessage);

      // Save AI response
      if (currentConversationId) {
        await conversationService.saveMessage(currentConversationId, aiMessage);
        await conversationService.updateConversation(
          currentConversationId,
          chatState.messages[0]?.text.slice(0, 50) + "..." ||
            "New conversation",
          response.slice(0, 100) + (response.length > 100 ? "..." : "")
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      chatState.isTyping = false;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
  };

  const handleConversationSelect = async (conversationId: string) => {
    const messages = await conversationService.getMessages(conversationId);
    chatState.messages = messages;
    setCurrentConversationId(conversationId);
  };

  return (
    <div className="flex h-screen bg-gradient-chat dark:bg-gray-900">
      <Sidebar
        isOpen={state.sidebarOpen}
        onToggle={() => {
          chatState.sidebarOpen = !chatState.sidebarOpen;
        }}
        onConversationSelect={handleConversationSelect}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          currentMood={state.userPreferences.mood}
          onMoodChange={(mood) => {
            chatState.userPreferences.mood = mood;
          }}
          onSidebarToggle={() => {
            chatState.sidebarOpen = !chatState.sidebarOpen;
          }}
        />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {state.messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {state.isTyping && <TypingDots />}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Upload Area */}
        {showImageUploader && (
          <div className="p-4 border-t border-pink-100 dark:border-gray-700 bg-pink-25 dark:bg-gray-800">
            <ImageUploader
              onImageSelect={setSelectedImage}
              onImageRemove={() => setSelectedImage("")}
              selectedImage={selectedImage}
            />
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-pink-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-4">
            <div className="flex items-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageUploader(!showImageUploader)}
                className="text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <QuickPrompts onPromptSelect={handlePromptSelect} />
                </div>
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="resize-none border-pink-200 focus:border-pink-400 focus:ring-pink-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={1}
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() && !selectedImage}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
