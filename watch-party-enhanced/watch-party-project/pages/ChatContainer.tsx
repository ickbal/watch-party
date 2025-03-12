"use client"
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../lib/socket';
import { ChatMessage as ChatMessageType, ChatState } from '../../lib/chat-types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import GifSelector from './GifSelector';
import { v4 as uuidv4 } from 'uuid';

interface ChatContainerProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  roomId: string;
  userId: string;
  username: string;
  userAvatar?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  socket,
  roomId,
  userId,
  username,
  userAvatar
}) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    typingUsers: []
  });
  const [showGifSelector, setShowGifSelector] = useState(false);
  
  useEffect(() => {
    // Listen for new messages
    socket.on('chatMessage', (message: ChatMessageType) => {
      setChatState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, message]
      }));
    });
    
    // Listen for typing indicators
    socket.on('userTyping', (typingUsername: string) => {
      setChatState(prevState => {
        if (prevState.typingUsers.includes(typingUsername)) {
          return prevState;
        }
        return {
          ...prevState,
          typingUsers: [...prevState.typingUsers, typingUsername]
        };
      });
    });
    
    socket.on('userStoppedTyping', (typingUsername: string) => {
      setChatState(prevState => ({
        ...prevState,
        typingUsers: prevState.typingUsers.filter(u => u !== typingUsername)
      }));
    });
    
    // Listen for reactions
    socket.on('messageReaction', (messageId: string, emoji: string, reactingUserId: string) => {
      setChatState(prevState => {
        const updatedMessages = prevState.messages.map(message => {
          if (message.id === messageId) {
            const existingReactionIndex = message.reactions?.findIndex(r => r.emoji === emoji);
            
            if (existingReactionIndex !== undefined && existingReactionIndex >= 0) {
              // Reaction exists, update it
              const updatedReactions = [...(message.reactions || [])];
              const reaction = updatedReactions[existingReactionIndex];
              
              if (!reaction.users.includes(reactingUserId)) {
                updatedReactions[existingReactionIndex] = {
                  ...reaction,
                  count: reaction.count + 1,
                  users: [...reaction.users, reactingUserId]
                };
              }
              
              return {
                ...message,
                reactions: updatedReactions
              };
            } else {
              // New reaction
              return {
                ...message,
                reactions: [
                  ...(message.reactions || []),
                  {
                    emoji,
                    count: 1,
                    users: [reactingUserId]
                  }
                ]
              };
            }
          }
          return message;
        });
        
        return {
          ...prevState,
          messages: updatedMessages
        };
      });
    });
    
    // Load chat history
    socket.emit('getChatHistory', roomId, (messages: ChatMessageType[]) => {
      setChatState(prevState => ({
        ...prevState,
        messages
      }));
    });
    
    return () => {
      socket.off('chatMessage');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('messageReaction');
    };
  }, [socket, roomId]);
  
  const handleSendMessage = (content: string, isRichText: boolean) => {
    const newMessage: ChatMessageType = {
      id: uuidv4(),
      userId,
      username,
      userAvatar,
      content,
      timestamp: Date.now(),
      isRichText,
      reactions: []
    };
    
    socket.emit('sendChatMessage', roomId, newMessage);
    
    // Optimistically add to local state
    setChatState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage]
    }));
  };
  
  const handleSendGif = (gifUrl: string) => {
    const newMessage: ChatMessageType = {
      id: uuidv4(),
      userId,
      username,
      userAvatar,
      content: '',
      timestamp: Date.now(),
      isRichText: false,
      gifUrl,
      reactions: []
    };
    
    socket.emit('sendChatMessage', roomId, newMessage);
    
    // Optimistically add to local state
    setChatState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage]
    }));
    
    setShowGifSelector(false);
  };
  
  const handleTyping = () => {
    socket.emit('typing', roomId, username);
  };
  
  const handleStopTyping = () => {
    socket.emit('stopTyping', roomId, username);
  };
  
  const handleAddReaction = (messageId: string, emoji: string) => {
    socket.emit('addReaction', roomId, messageId, emoji);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="bg-gray-800 p-3 border-b border-gray-700">
        <h2 className="text-white font-bold">Chat</h2>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showGifSelector ? (
          <GifSelector 
            onSelectGif={handleSendGif} 
            onClose={() => setShowGifSelector(false)} 
          />
        ) : (
          <ChatMessages
            messages={chatState.messages}
            currentUserId={userId}
            onAddReaction={handleAddReaction}
            typingUsers={chatState.typingUsers.filter(u => u !== username)}
          />
        )}
        
        <ChatInput
          socket={socket}
          roomId={roomId}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          onOpenGifSelector={() => setShowGifSelector(true)}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
