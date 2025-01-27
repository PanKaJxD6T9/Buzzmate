import React, {useState, useEffect} from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";

function ChatList() {

  const [{ contacts }, dispatch] = useStateProvider();

  const [pageType, setPageType] = useState("default");

  useEffect(()=>{
    if(contacts){
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contacts])

  return (
    <div className="bg-gray-900 flex flex-col max-h-screen z-20">
      {
        pageType === "default" && (
          <>
            <SearchBar />
            <List />
            <ChatListHeader />
          </>
        )

      }
      {
        pageType === "all-contacts" && (
          <>
            <ContactsList />
          </>
        )
      }
    </div>
  );
}

export default ChatList;
