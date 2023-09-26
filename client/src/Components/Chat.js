import React, {useState} from "react";

const Chat = ({clientId, gameId, sendJsonMessage, chat}) => {
    const [message, setMessage] = useState('')

    const handleMessageText = (e) => {
        e.preventDefault()
        setMessage(e.target.value)
    }

    const sendMessage = () => {
        const payload = {
            "method": "chat",
            "clientId": clientId,
            "gameId": gameId,
            "message": message
        }
        sendJsonMessage(payload)
    }

    return <div>
        <div>
            {chat.map((message)=>{
                return <p>{message.clientId} - {message.message}</p>
            })}
        </div>
        <input type='text' onChange={handleMessageText}/>
        <button onClick={sendMessage}>Chat</button>
    </div>
}

export default Chat