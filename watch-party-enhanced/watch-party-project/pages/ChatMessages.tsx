"use client"
import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../../lib/chat-types';
import ChatMessage from './ChatMessage';

interface ChatMessagesProps {
  messages: ChatMessageType[];
  currentUserId: string;
  onAddReaction: (messageId: string, emoji: string) => void;
  typingUsers: string[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  currentUserId, 
  onAddReaction,
  typingUsers 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-center">
            No messages yet. Start the conversation!
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              currentUserId={currentUserId}
              onAddReaction={onAddReaction}
            />
          ))}
        </>
      )}
      
      {typingUsers.length > 0 && (
        <div className="text-gray-400 text-sm italic">
          {typingUsers.length === 1 
            ? `${typingUsers[0]} is typing...` 
            : `${typingUsers.join(', ')} are typing...`}
          <div className="inline-flex">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
