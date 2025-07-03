import { supabase } from "@/lib/supabase";
import { Message } from "@/store/chatStore";

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  preview: string;
  created_at: string;
  updated_at: string;
}

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }

    return data || [];
  },

  async createConversation(
    title: string,
    preview: string
  ): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title,
        preview,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }

    return data?.id || null;
  },

  async updateConversation(
    id: string,
    title: string,
    preview: string
  ): Promise<void> {
    const { error } = await supabase
      .from("conversations")
      .update({
        title,
        preview,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating conversation:", error);
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return (
      data?.map((msg) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender_type,
        timestamp: new Date(msg.created_at),
        image: msg.image_url,
        mood: msg.mood,
      })) || []
    );
  },

  async saveMessage(conversationId: string, message: Message): Promise<void> {
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      content: message.text,
      sender_type: message.sender,
      image_url: message.image,
      mood: message.mood,
      created_at: message.timestamp.toISOString(),
    });

    if (error) {
      console.error("Error saving message:", error);
    }
  },
};
