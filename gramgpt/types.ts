
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ChatHistoryPart {
  text: string;
}

export interface ChatHistoryEntry {
  role: 'user' | 'model';
  parts: ChatHistoryPart[];
}
