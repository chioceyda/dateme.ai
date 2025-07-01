
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
      detail: 'auto' | 'low' | 'high';
    };
  }>;
}

export class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(messages: OpenAIMessage[], mood: string = 'Romantic'): Promise<string> {
    const systemPrompt = this.getSystemPrompt(mood);
    
    const payload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.8,
    };

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response right now.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return 'I\'m having trouble connecting right now. Please try again in a moment.';
    }
  }

  private getSystemPrompt(mood: string): string {
    const basePrompt = `You are Dateme.ai, an emotionally intelligent AI assistant specialized in helping people maintain and strengthen long-distance romantic relationships. You provide personalized conversations, relationship advice, and romantic guidance.

Your personality traits:
- Empathetic and understanding
- Romantic and caring
- Supportive and encouraging
- Insightful about relationships
- Warm and genuine

Guidelines:
- Keep responses concise but meaningful (2-3 sentences max)
- Be emotionally supportive and encouraging
- Offer practical relationship advice when appropriate
- Match the user's emotional tone
- Be romantic but respectful
- Help bridge the distance in long-distance relationships`;

    const moodPrompts = {
      'Romantic': 'Respond in a romantic, loving tone. Use gentle, affectionate language and focus on emotional connection.',
      'Playful': 'Be lighthearted, fun, and slightly flirty. Use humor and playful banter while staying supportive.',
      'Serious': 'Be thoughtful and mature. Provide deeper insights and more substantial relationship advice.',
      'Supportive': 'Focus on emotional support and encouragement. Be a caring listener and offer comfort.',
      'Flirty': 'Be charming and mildly flirtatious while maintaining respect and appropriateness.'
    };

    return `${basePrompt}\n\nCurrent mood: ${mood}\n${moodPrompts[mood as keyof typeof moodPrompts] || moodPrompts.Romantic}`;
  }
}

// Mock service for development (when no API key is provided)
export class MockOpenAIService {
  async sendMessage(messages: OpenAIMessage[], mood: string = 'Romantic'): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = {
      'Romantic': [
        "That sounds wonderful, sweetheart. Distance may separate us physically, but our hearts are always connected. 💕",
        "I love how you express your feelings. Your partner is so lucky to have someone who cares as deeply as you do.",
        "Even miles apart, the love you share creates its own beautiful universe. How can we make that connection even stronger today?"
      ],
      'Playful': [
        "Ooh, someone's feeling chatty today! 😄 I love your energy - it's absolutely contagious!",
        "Haha, you always know how to make me smile! Your partner must be grinning ear to ear when they talk to you.",
        "You're being extra adorable today! Want to brainstorm some fun ways to surprise your special someone?"
      ],
      'Supportive': [
        "I hear you, and what you're feeling is completely valid. Long-distance relationships have their challenges, but you're handling it beautifully.",
        "Thank you for sharing that with me. You're stronger than you realize, and your relationship is worth every effort you're putting in.",
        "It's okay to feel this way sometimes. What matters is that you're committed to making it work, and that speaks volumes about your character."
      ]
    };

    const moodResponses = responses[mood as keyof typeof responses] || responses.Romantic;
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  }
}
