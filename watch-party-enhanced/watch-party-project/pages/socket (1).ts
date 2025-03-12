"use client"
import { io, Socket } from "socket.io-client"
import { MediaElement, Playlist, RoomState } from "./types"
import { ChatMessage } from "./chat-types"

export interface ServerToClientEvents {
  update: (room: RoomState) => void
  chatMessage: (message: ChatMessage) => void
  userTyping: (username: string) => void
  userStoppedTyping: (username: string) => void
  messageReaction: (messageId: string, emoji: string, userId: string) => void
}

export interface ClientToServerEvents {
  fetch: () => void
  setProgress: (progress: number) => void
  setPaused: (paused: boolean) => void
  setPlaybackRate: (playbackRate: number) => void
  setLoop: (loop: boolean) => void
  playUrl: (url: string) => void
  playItem: (index: number) => void
  addToPlaylist: (url: string) => void
  removeFromPlaylist: (index: number) => void
  sendChatMessage: (roomId: string, message: ChatMessage) => void
  typing: (roomId: string, username: string) => void
  stopTyping: (roomId: string, username: string) => void
  addReaction: (roomId: string, messageId: string, emoji: string) => void
  getChatHistory: (roomId: string, callback: (messages: ChatMessage[]) => void) => void
}

export function createClientSocket(
  roomId: string
): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io({
    path: "/api/socketio",
    query: {
      roomId,
    },
  })
}

export function playItemFromPlaylist(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  playlist: Playlist,
  index: number
) {
  if (index >= 0 && index < playlist.items.length) {
    socket.emit("playItem", index)
  }
}
