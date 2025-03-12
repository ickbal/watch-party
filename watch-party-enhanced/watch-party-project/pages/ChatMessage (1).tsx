"use client"
import React, { useState } from 'react';
import { ChatMessage as ChatMessageType, MessageReaction } from '../../lib/chat-types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
  currentUserId: string;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUserId, onAddReaction }) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏'];
  
  const handleReactionClick = (emoji: string) => {
    onAddReaction(message.id, emoji);
    setShowReactionPicker(false);
  };
  
  return (
    <div className="mb-4 group">
      <div className="flex items-start">
        {message.userAvatar ? (
          <img 
            src={message.userAvatar} 
            alt={message.username} 
            className="w-8 h-8 rounded-full mr-2"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
            <span className="text-white text-sm font-bold">
              {message.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-bold text-white mr-2">{message.username}</span>
            <span className="text-xs text-gray-400">{formattedTime}</span>
          </div>
          
          <div className="mt-1 text-white">
            {message.gifUrl ? (
              <div className="max-w-xs">
                <img 
                  src={message.gifUrl} 
                  alt="GIF" 
                  className="rounded-md max-h-60 w-auto"
                />
              </div>
            ) : message.isRichText ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ) : (
              <p>{message.content}</p>
            )}
          </div>
          
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {message.reactions.map((reaction, index) => (
                <button
                  key={index}
                  onClick={() => onAddReaction(message.id, reaction.emoji)}
                  className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs
                    ${reaction.users.includes(currentUserId) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'}
                  `}
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="text-gray-400 hover:text-white p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {showReactionPicker && (
        <div className="absolute mt-1 bg-gray-800 rounded-lg p-2 shadow-lg z-10">
          <div className="flex space-x-2">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className="hover:bg-gray-700 p-1 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
