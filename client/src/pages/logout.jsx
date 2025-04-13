import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";

function logout() {

  const [{userInfo, socket}, dispatch] = useStateProvider();
  const router = useRouter();

  React.useEffect(() => {
    socket.current.emit("signout", userInfo.id);
    dispatch({type: reducerCases.SET_USER_INFO, userInfo: undefined});
    signOut(firebaseAuth);
    router.push("/login");
  }, [socket]);

  return <div className="bg-conversation-panel-background"></div>;
}

export default logout;
