"use client"
import { FC, useEffect, useState } from "react"
import Player from "./player/Player"
import {
  ClientToServerEvents,
  createClientSocket,
  ServerToClientEvents,
} from "../lib/socket"
import Button from "./action/Button"
import { Socket } from "socket.io-client"
import ConnectingAlert from "./alert/ConnectingAlert"
import PlaylistMenu from "./playlist/PlaylistMenu"
import IconLoop from "./icon/IconLoop"
import InputUrl from "./input/InputUrl"
import UserList from "./user/UserList"
import ChatContainer from "./chat/ChatContainer"
import { v4 as uuidv4 } from 'uuid'

interface Props {
  id: string
}

let connecting = false

const Room: FC<Props> = ({ id }) => {
  const [connected, setConnected] = useState(false)
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null)
  const [url, setUrl] = useState("")
  const [userId] = useState(() => uuidv4())
  const [username, setUsername] = useState(() => `User_${Math.floor(Math.random() * 1000)}`)
  const [showChat, setShowChat] = useState(true)

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      if (socket !== null) {
        setConnected(socket.connected)
      } else {
        const newSocket = createClientSocket(id)
        newSocket.on("connect", () => {
          setConnected(true)
        })
        setSocket(newSocket)
      }
    })

    return () => {
      if (socket !== null) {
        socket.disconnect()
      }
    }
  }, [id, socket])

  const connectionCheck = () => {
    if (socket !== null && socket.connected) {
      connecting = false
      setConnected(true)
      return
    }
    setTimeout(connectionCheck, 100)
  }

  if (!connected || socket === null) {
    if (!connecting) {
      connecting = true
      connectionCheck()
    }
    return (
      <div className={"flex justify-center"}>
        <ConnectingAlert />
      </div>
    )
  }

  return (
    <div className={"flex flex-col lg:flex-row gap-2"}>
      <div className={"grow lg:w-3/4"}>
        <Player roomId={id} socket={socket} />

        <div className={"flex flex-row gap-1 p-1"}>
          <Button
            tooltip={"Do a forced manual sync"}
            className={"p-2 flex flex-row gap-1 items-center"}
            onClick={() => {
              console.log("Fetching update", socket?.id)
              socket?.emit("fetch")
            }}
          >
            <IconLoop className={"hover:animate-spin"} />
            <div className={"hidden-below-sm"}>Manual sync</div>
          </Button>
          <InputUrl
            className={"grow"}
            url={url}
            placeholder={"Play url now"}
            tooltip={"Play given url now"}
            onChange={setUrl}
            onSubmit={() => {
              console.log("Requesting", url, "now")
              socket?.emit("playUrl", url)
              setUrl("")
            }}
          >
            Play
          </InputUrl>
          <Button
            tooltip={showChat ? "Hide chat" : "Show chat"}
            className={"p-2 flex flex-row gap-1 items-center"}
            onClick={() => setShowChat(!showChat)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className={"hidden-below-sm"}>{showChat ? "Hide chat" : "Show chat"}</div>
          </Button>
        </div>

        <div className="flex flex-row gap-2 mt-2">
          <div className="w-full lg:w-1/2">
            <UserList socket={socket} />
          </div>
          <div className="w-full lg:w-1/2">
            <PlaylistMenu socket={socket} />
          </div>
        </div>
      </div>

      {showChat && (
        <div className={"lg:w-1/4 h-[500px] lg:h-auto"}>
          <ChatContainer 
            socket={socket} 
            roomId={id} 
            userId={userId} 
            username={username} 
          />
        </div>
      )}
    </div>
  )
}

export default Room
