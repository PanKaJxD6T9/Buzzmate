import React, { useEffect, useState } from "react";
import axios from "axios";
import { GET_ALL_USERS_ROUTE } from "@/utils/ApiRoutes";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ChatListItem from "./ChatListItem";


function ContactsList() {

  const [allContacts, setAllContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();

  useEffect(() => {
    const getContacts = async () => {
      try{
        const {data: {users}} = await axios.get(GET_ALL_USERS_ROUTE);
        setAllContacts(users);
      } catch(err){
        console.log(err);
      }
    }
    getContacts();
  }, [])


  return <div className="h-full flex flex-col">
    <div className="h-16 flex items-end px-3 py-4">
      <div className="flex items-center gap-12 text-white">
        <BiArrowBack className="cursor-pointer text-xl" onClick={() => dispatch({type: reducerCases.SET_ALL_CONTACTS})}/>
        <span className="text-2xl">New Chat</span>
      </div>
    </div>
    <div className="bg-search-input-container-background flex py-3 px-5 items-center gap-3">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearch className="text-white cursor-pointer text-xl"/>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search Contacts"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
            // onChange={(e) => console.log(e.target.value)}
          />
        </div>
      </div>
    </div>
    <div className="overflow-auto custom-scrollbar">
      {
        Object.entries(allContacts).map(([initial, list]) => {
          return (
            <div key={Date.now() + initial} className="">
              <div className="text-teal-light pl-10 py-5 ">
                {initial}
              </div>
              {
                list.map((user) => {
                  return (
                    <ChatListItem key={user._id} data={user} isContactPage={true} />
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  </div>;
}

export default ContactsList;
