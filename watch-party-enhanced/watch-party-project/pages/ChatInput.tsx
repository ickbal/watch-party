"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../lib/socket';

interface ChatInputProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  roomId: string;
  onSendMessage: (content: string, isRichText: boolean) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  onOpenGifSelector: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  socket,
  roomId,
  onSendMessage,
  onTyping,
  onStopTyping,
  onOpenGifSelector
}) => {
  const [message, setMessage] = useState('');
  const [isRichText, setIsRichText] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle typing indicator
  useEffect(() => {
    if (message.length > 0) {
      onTyping();
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping();
      }, 3000);
    } else {
      onStopTyping();
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, onTyping, onStopTyping]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message, isRichText);
      setMessage('');
      
      // Focus back on input after sending
      inputRef.current?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter (without shift for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    if (!inputRef.current) return;
    
    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;
    const selectedText = message.substring(start, end);
    const newText = message.substring(0, start) + prefix + selectedText + suffix + message.substring(end);
    
    setMessage(newText);
    setIsRichText(true);
    
    // Focus back and set cursor position after formatting
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.selectionStart = start + prefix.length;
        inputRef.current.selectionEnd = start + prefix.length + selectedText.length;
      }
    }, 0);
  };
  
  return (
    <div className="border-t border-gray-700 p-3">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center mb-2">
          <button
            type="button"
            onClick={() => setShowFormatting(!showFormatting)}
            className="text-gray-400 hover:text-white p-2"
            title="Formatting options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={onOpenGifSelector}
            className="text-gray-400 hover:text-white p-2"
            title="Add GIF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          <div className="ml-auto flex items-center">
            <label className="flex items-center text-sm text-gray-400 mr-2">
              <input
                type="checkbox"
                checked={isRichText}
                onChange={(e) => setIsRichText(e.target.checked)}
                className="mr-1"
              />
              Rich Text
            </label>
          </div>
        </div>
        
        {showFormatting && (
          <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-800 rounded">
            <button
              type="button"
              onClick={() => insertFormatting('**')}
              className="text-gray-200 hover:bg-gray-700 p-1 rounded"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*')}
              className="text-gray-200 hover:bg-gray-700 p-1 rounded"
              title="Italic"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('~~')}
              className="text-gray-200 hover:bg-gray-700 p-1 rounded"
              title="Strikethrough"
            >
              <span className="line-through">S</span>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`')}
              className="text-gray-200 hover:bg-gray-700 p-1 rounded"
              title="Code"
            >
              <code>Code</code>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('[', '](url)')}
              className="text-gray-200 hover:bg-gray-700 p-1 rounded"
              title="Link"
            >
              <span className="underline">Link</span>
            </button>
          </div>
        )}
        
        <div className="flex">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-l-md p-3 focus:outline-none resize-none"
            rows={2}
          />
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
