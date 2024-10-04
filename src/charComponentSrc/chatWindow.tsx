import { KeyboardEvent, MouseEvent, useEffect, useRef } from "react"
import { Socket } from "socket.io-client";

type ChatWindowProps = {
    socket: Socket | null;
    uid: string;
    isConnecting: boolean;
    messages: { uid: string, message: string }[],
    setMessages: React.Dispatch<React.SetStateAction<{ uid: string, message: string }[]>>;
}
export default function ChatWindow({ socket, uid, isConnecting, messages, setMessages }: ChatWindowProps) {
    const messageInputRef = useRef<HTMLInputElement>(null)
    const chatBody = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (chatBody.current) {
            chatBody.current.scrollTop = chatBody.current.scrollHeight
        }
    }, [messages.length])

    const handleSendMessage = (e: MouseEvent<HTMLDivElement>) => {
        if (messageInputRef.current && socket) {
            const msg = messageInputRef.current.value
            if (!msg.trim()) return
            setMessages(prev => [...prev, { uid, message: msg }])
            console.log('msg', msg)
            socket.emit("message", msg)
            messageInputRef.current.value = ""
        }
    }

    const handleOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (messageInputRef.current && socket && e.key === "Enter") {
            const msg = messageInputRef.current.value
            if (!msg.trim()) return
            setMessages(prev => [...prev, { uid, message: msg }])
            console.log('msg', msg)
            socket.emit("message", msg)
            messageInputRef.current.value = ""
        }
    }

    return <div className="chat">
        <div className="chat-header-wrapper">
            {/* Header */}
            <h1>{isConnecting ? 'Connecting...' : 'Messages'}</h1>
        </div>
        <div className="chat-body-wrapper" ref={chatBody}>
            {/* Body */}
            {/* {messages.map((msg, idx) => <div className={`chat-bubble ${uid === msg.uid ? 'chat-bubble-me' : 'chat-bubble-other'}`} key={idx}>
                <p>{msg.message}</p>
            </div>)} */}
            {messages.map((msg, idx) => uid === msg.uid ?
                <div className={`chat-bubble ${uid === msg.uid ? 'chat-bubble-me' : 'chat-bubble-other'}`} >
                    <p>{msg.message}</p>
                </div> : <div key={idx} className="agent-chat-message-row">
                    <div className="agent-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440Zm-80-280q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z" /></svg>
                    </div>
                    <div className={`chat-bubble ${uid === msg.uid ? 'chat-bubble-me' : 'chat-bubble-other'}`} >
                        <span className="agent-message-subtitle">John Doe - Support Agent</span>
                        <p>{msg.message}</p>
                    </div>
                </div>)}
        </div>
        <div className="chat-footer-wrapper">
            {/* Footer */}
            <div className="chat-input-wrapper">
                <input ref={messageInputRef} onKeyDown={handleOnEnter} type="text" placeholder="Type your message..." />
                <div onClick={handleSendMessage} style={{ cursor: "pointer" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#5f6368"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" /></svg>
                </div>
            </div>
        </div>
    </div>
}