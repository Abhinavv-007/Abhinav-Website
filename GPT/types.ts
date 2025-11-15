
export interface Message {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}
