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
        setMessage('')
    }

    return <div className={'flex flex-col border-gray-400 border-2 gap-y-4 max-w-md'}>
        <div>
            {chat.map((message, key)=>{
                return <p key={key}>{message.clientId} - {message.message}</p>
            })}
        </div>
        <div className={'flex flex-row justify-evenly mb-0'}>
            <input type='text' onChange={handleMessageText} className={'border-2 border-blue-600'} value={message}/>
            <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'}  onClick={sendMessage}>Chat</button>
        </div>
    </div>
}

export default Chat