import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";

function MessageBar() {

  const [{userInfo, currentChatUser, socket}, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const sendMessage = async()=>{
    try{
      const {data} = await axios.post(ADD_MESSAGE_ROUTE, {
        message,
        from: userInfo?.id,
        to: currentChatUser?.id
      });
      socket.current.emit("send-message", {
        message: data.message,
        from: userInfo?.id,
        to: currentChatUser?.id
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message
        },
        fromSelf: true
      });
      setMessage("");
    } catch(err){
      console.log(err);
    }
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 h-20 px-4 flex items-center gap-6 relative shadow-lg border-t border-gray-700">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile 
            className="text-gray-300 hover:text-yellow-400 cursor-pointer text-xl transition-colors duration-300" 
            title="Emoji"
          />
          <ImAttachment 
            className="text-gray-300 hover:text-blue-400 cursor-pointer text-xl transition-colors duration-300" 
            title="Attach File or Document"
          />
        </div>
        <div className="w-full rounded-lg h-12 flex items-center bg-gray-800 hover:bg-gray-750 transition-all duration-300 shadow-inner">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-transparent text-start focus:outline-none text-gray-100 h-full rounded-lg px-5 py-4 w-full placeholder-gray-400"
          />
        </div>
        <div className="flex w-10 items-center justify-center" onClick={sendMessage}>
          <button 
            className={`p-2 rounded-full hover:bg-blue-600 transition-colors duration-300 ${
              message.trim() ? 'bg-blue-500' : 'bg-gray-700'
            }`}
            disabled={!message.trim()}
          >
            <MdSend 
              className={`cursor-pointer text-xl ${
                message.trim() ? 'text-white' : 'text-gray-400'
              }`} 
              title="Send"
              
            />
          </button>
        </div>
      </>
    </div>
  );
}

export default MessageBar;
