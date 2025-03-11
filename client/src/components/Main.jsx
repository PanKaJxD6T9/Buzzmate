import React, { useState, useEffect, useRef } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
  const [{ userInfo, currentChatUser, messagesSearch }, dispatch] = useStateProvider();
  const [loginRedirect, setLoginRedirect] = useState(false);
  const router = useRouter();
  const socket = useRef();
  const [socketEvent, setSocketEvent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async(user) => {
      if (!user) {
        setLoginRedirect(true);
        return;
      }
      
      try {
        const {data} = await axios.post(CHECK_USER_ROUTE, {email: user.email});
        
        if(!data.success){
          router.push("/login");
          return;
        }

        if (data.data) {
          const { id, name, email, profileImage, about } = data.data;
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: { 
              id, 
              email, 
              name, 
              profileImage, 
              about,
              status: "" 
            }
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  useEffect(() => {
    if(loginRedirect){
      router.push("/login");
    }
  }, [loginRedirect, router]);

  useEffect(()=>{
    if(userInfo){
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({
        type: reducerCases.SET_SOCKET,
        socket
      })
    }
  }, [userInfo])

  useEffect(()=>{
    if(socket.current && !socketEvent){
      socket.current.on("message-received", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage:{
            ...data.message,
          }
        })
      })

      setSocketEvent(true);
    }
  }, [socket.current])

  useEffect(()=>{
    const getMessages = async () => {
      const {data: {messages}} = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`);
      // console.log({data});
      dispatch({
        type: reducerCases.SET_MESSAGES,
        messages
      })
    }

    if(currentChatUser?.id){
      getMessages();
    }
  }, [currentChatUser])

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full">
      <ChatList />
      {
        currentChatUser ? 
        <div className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}>
          <Chat />
          {messagesSearch && <SearchMessages />}
        </div> : 
        <Empty />
      }
    </div>
  );
}

export default Main;
