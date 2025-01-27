import React, { useState, useEffect } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import Chat from "./Chat/Chat";

function Main() {
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
  const [loginRedirect, setLoginRedirect] = useState(false);
  const router = useRouter();

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

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full">
      <ChatList />
      {
        currentChatUser ? <Chat /> : <Empty />
      }
    </div>
  );
}

export default Main;
