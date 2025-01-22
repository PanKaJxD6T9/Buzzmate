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
;

function Main() {

  const [{ userInfo }, dispatch] = useStateProvider();
  const [loginRedirect, setLoginRedirect] = useState(false)
  const router = useRouter();

  useEffect(()=>{
    if(loginRedirect){
      router.push("/login");
    }
  }, [loginRedirect])

  onAuthStateChanged(firebaseAuth, async(user) => {
    if (!user) {
      setLoginRedirect(true)
    }
    if(!userInfo && user?.email){
      const {data} = await axios.post(CHECK_USER_ROUTE, {email: user.email});
      
      if(!data.success){
        router.push("/login");
      }

      if (data.data) {
        const { id, name, email, image, about } = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: { id, email, name, profileImage: image, about },
          status: ""
        });
      }
    }
      
    })

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full">
      <ChatList />
      <Empty />
    </div>
  );
}

export default Main;
