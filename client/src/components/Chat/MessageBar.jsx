import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {ssr: false});

function MessageBar() {

  const [{userInfo, currentChatUser, socket}, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const emojiRef = React.useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadPhoto, setuploadPhoto] = useState(false)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  
  
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

  React.useEffect(() => {
      const handleClickOutside = (event) => {
        if(event.target.id !== "emoji-opener") {
          if(emojiRef.current && !emojiRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
          }
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);

  const handleEmojiDialogBox = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage += emoji.emoji);
  };

  React.useEffect(()=>{
    if(uploadPhoto){
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setuploadPhoto(false);
        }, 1000);
      }
    }
  }, [uploadPhoto])

  const photoPickerChangeHandler = async(e) => {
    try{
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id
        },
      });
      if (response.status === 201) {
        socket.current.emit("send-message", {
          message: response.data.message,
          from: userInfo?.id,
          to: currentChatUser?.id
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message
          },
          fromSelf: true
        });
      }
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 h-20 px-4 flex items-center gap-6 relative shadow-lg border-t border-gray-700">
      {
        !showAudioRecorder && (
      <>
        <div className="flex gap-6">
          
          <BsEmojiSmile 
            className="text-gray-300 hover:text-yellow-400 cursor-pointer text-xl transition-colors duration-300" 
            title="Emoji"
            id="emoji-opener"
            onClick={handleEmojiDialogBox}
          />
          {showEmojiPicker && (
            <div className="absolute bottom-24 left-16 z-40" ref={emojiRef}>
              <EmojiPicker 
                onEmojiClick={handleEmojiClick}
                theme="dark"
              />
            </div>
          )}
            <ImAttachment 
              className="text-gray-300 hover:text-blue-400 cursor-pointer text-xl transition-colors duration-300" 
              title="Attach File or Document"
              id="file-opener"
              onClick={() => setuploadPhoto(true)}
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
            // disabled={!message.trim()}
          >
            {
              message.length ? (
                <MdSend
                  className={`cursor-pointer text-xl ${message.trim() ? 'text-white' : 'text-gray-400'
                    }`}
                  title="Send"

                />
              )
                : (
                <FaMicrophone
                  className="text-gray-300 hover:text-green-400 cursor-pointer text-xl transition-colors duration-300"
                  title="Record Audio"
                  onClick={() => setShowAudioRecorder(true)}
                />
              )
            }
            
          </button>
        </div>
      </>
      )}
      {uploadPhoto && <PhotoPicker onChange={photoPickerChangeHandler}/>}
      {showAudioRecorder && <CaptureAudio hide={()=>setShowAudioRecorder(false)}/>}
    </div>
  );
}

export default MessageBar;
