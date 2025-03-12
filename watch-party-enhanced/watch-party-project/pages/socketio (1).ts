import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"
import { NextApiResponseServerIO } from "../../lib/types"
import { ChatMessage } from "../../lib/chat-types"

export const config = {
  api: {
    bodyParser: false,
  },
}

const chatHistory: Record<string, ChatMessage[]> = {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...")
    // adapt Next's net Server to socket.io
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    })
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("New client connected", socket.id)
      const roomId = socket.handshake.query.roomId as string
      socket.join(roomId)

      // Initialize chat history for room if it doesn't exist
      if (!chatHistory[roomId]) {
        chatHistory[roomId] = []
      }

      // Chat message handling
      socket.on("sendChatMessage", (roomId: string, message: ChatMessage) => {
        // Store message in history
        chatHistory[roomId].push(message)
        // Limit history to 100 messages per room
        if (chatHistory[roomId].length > 100) {
          chatHistory[roomId].shift()
        }
        // Broadcast to all clients in the room
        io.to(roomId).emit("chatMessage", message)
      })

      // Typing indicators
      socket.on("typing", (roomId: string, username: string) => {
        socket.to(roomId).emit("userTyping", username)
      })

      socket.on("stopTyping", (roomId: string, username: string) => {
        socket.to(roomId).emit("userStoppedTyping", username)
      })

      // Message reactions
      socket.on("addReaction", (roomId: string, messageId: string, emoji: string) => {
        const userId = socket.id
        io.to(roomId).emit("messageReaction", messageId, emoji, userId)
        
        // Update reaction in chat history
        if (chatHistory[roomId]) {
          const messageIndex = chatHistory[roomId].findIndex(m => m.id === messageId)
          if (messageIndex >= 0) {
            const message = chatHistory[roomId][messageIndex]
            const reactions = message.reactions || []
            const existingReactionIndex = reactions.findIndex(r => r.emoji === emoji)
            
            if (existingReactionIndex >= 0) {
              const reaction = reactions[existingReactionIndex]
              if (!reaction.users.includes(userId)) {
                reactions[existingReactionIndex] = {
                  ...reaction,
                  count: reaction.count + 1,
                  users: [...reaction.users, userId]
                }
              }
            } else {
              reactions.push({
                emoji,
                count: 1,
                users: [userId]
              })
            }
            
            chatHistory[roomId][messageIndex] = {
              ...message,
              reactions
            }
          }
        }
      })

      // Get chat history
      socket.on("getChatHistory", (roomId: string, callback) => {
        callback(chatHistory[roomId] || [])
      })

      // Handle existing socket events for video synchronization
      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id)
      })
    })
  }
  res.end()
}
