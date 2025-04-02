import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import React from "react";
import ChatListItem from "./ChatListItem";
import axios from "axios";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";

function List() {

  const [{userInfo, userContacts, onlineUsers, filteredContacts}, dispatch] = useStateProvider();

  React.useEffect(() => {

    const getContacts = async () => {
      try{

        const {data: {users, onlineUsers}} = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers
        })
        dispatch({
          type: reducerCases.SET_USER_CONTACTS,
          userContacts: users
        })

      } catch (err) {
        console.log(err)
      }
    };

    if(userInfo?.id){
      getContacts();
    }

  }, [userInfo])

  return (
    <div className="bg-gray-900 flex-auto overflow-auto max-h-full custom-scrollbar">
      {
        filteredContacts && filteredContacts.length > 0
        ? 
        filteredContacts.map((contact) => (
          <ChatListItem 
            data={contact} 
            key={contact.id}
            isOnline={onlineUsers?.includes(contact.id)}
          />
        ))
        : 
        userContacts.map((contact) => (
          <ChatListItem 
            data={contact} 
            key={contact.id}
            isOnline={onlineUsers?.includes(contact.id)}
          />
        ))
      }
    </div>
  );
}

export default List;
