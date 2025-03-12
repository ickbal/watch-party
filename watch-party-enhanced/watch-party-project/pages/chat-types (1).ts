export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  timestamp: number;
  isRichText: boolean;
  gifUrl?: string;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // userIds who reacted
}

export interface ChatState {
  messages: ChatMessage[];
  typingUsers: string[]; // usernames of users currently typing
}

export interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  isTyping: boolean;
}