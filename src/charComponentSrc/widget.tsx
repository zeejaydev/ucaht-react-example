import { useEffect, useState } from "react"
import "./main.css"
import ChatWindow from "./chatWindow"
import { Socket, io } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"
type UChatWidgetProps = {
    wsUri: string,
    style?: React.CSSProperties,
    className?: string,
    bgColor?: string,
    icon?: string
    iconHeight?: number,
    iconWidth?: number,
}

export default function UChatWidget({ style, className, bgColor, icon, iconHeight, iconWidth, wsUri }: UChatWidgetProps) {
    const [chatIsOpen, setChatIsOpen] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket | null>(null)
    const [currentUserId, setCurrentUserId] = useState<string>("")
    const [messages, setMessages] = useState<{ uid: string, message: string }[]>([])
    const [wsConnecting, setWsConnecting] = useState<boolean>(true)

    useEffect(() => {
        if (socket) return
        let ws: Socket
        try {
            ws = io(wsUri);
            setCurrentUserId(uuidv4())
            setSocket(ws)
        } catch (error) {
            console.log(error)
        }

        return () => {
            console.log('clean up')
            if (ws) {
                ws.on("connect", () => {
                    console.log('connected', ws.id)
                    setWsConnecting(false)
                })
                ws.on("disconnect", () => {
                    console.log("disconnected");
                });
                ws.on("connect_error", (e) => {
                    console.log('connect error', e.message)
                })
                ws.on("receive-message", (msg: { uid: string, message: string }) => {
                    setMessages(prev => [...prev, msg])
                })
            }
        }
    }, [wsUri, socket])

    // useEffect(() => {
    //     prevent page refresh when there are messages
    //     if (messages.length) {
    //         window.onbeforeunload = (e) => {
    //             e.preventDefault()
    //             return true
    //         }
    //     }
    //     return () => {
    //         if (messages.length) {
    //             window.onbeforeunload = null
    //         }
    //     }
    // }, [messages.length])

    const openChat = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.preventDefault()
        setChatIsOpen(prev => !prev)
    }

    return <>
        {chatIsOpen && <ChatWindow messages={messages} setMessages={setMessages} isConnecting={wsConnecting} socket={socket} uid={currentUserId} />}
        <div onClick={openChat} style={style ?? { backgroundColor: bgColor ?? "white" }}
            className={className ?? `widget ${bgColor}`}
        >
            {icon ? <img width={iconWidth ?? 24} height={iconHeight ?? 24} src={icon} alt="chat-icon" /> : <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#5f6368"><path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" /></svg>}
        </div>
    </>
}