import React, { useEffect, useState } from "react";
import axios from "axios";
import { GET_ALL_USERS_ROUTE } from "@/utils/ApiRoutes";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ChatListItem from "./ChatListItem";
import { IoCloseOutline } from "react-icons/io5";


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

  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleClearInput = () => {
    setSearchText("");
  };


  return <div className="h-full flex flex-col">
    <div className="h-16 flex items-end px-3 py-4">
      <div className="flex items-center gap-6 text-white">
        <button 
          className="flex items-center gap-2 hover:bg-gray-700 rounded-full p-2 transition-colors duration-300"
          onClick={() => dispatch({type: reducerCases.SET_ALL_CONTACTS})}
        >
          <BiArrowBack className="text-xl" />
        </button>
        <h2 className="text-2xl font-semibold">New Chat</h2>
      </div>
    </div>
    <div className="bg-search-input-container-background flex py-3 px-5 items-center gap-3">
      <div 
        className={`bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 flex items-center gap-3 px-3 py-1.5 rounded-lg flex-grow
          transition-all duration-300 ${isFocused ? 'shadow-lg ring-2 ring-green-500' : 'hover:bg-opacity-90'}`}
      >
        <div>
          <BiSearch className={`text-xl transition-colors duration-300 ${isFocused ? 'text-green-500' : 'text-white'} cursor-pointer hover:scale-110`}/>
        </div>
        <div className="flex-grow relative">
          <input
            type="text"
            value={searchText}
            placeholder="Search or start new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full placeholder:text-gray-300"
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchText && (
            <button
              onClick={handleClearInput}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-green-500 transition-colors duration-300"
            >
              <IoCloseOutline className="text-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
    <div className="overflow-auto custom-scrollbar h-full">
      {
        Object.entries(allContacts).map(([initial, list]) => {
          return (
            <div key={Date.now() + initial} className="mb-2">
              <div className="sticky top-0 bg-dark-secondary z-10">
                <div className="text-teal-light px-6 py-2 text-lg font-semibold backdrop-blur-sm bg-opacity-80">
                  {initial}
                </div>
              </div>
              <div className="space-y-1">
                {
                  list.map((user) => {
                    return (
                      <div className="hover:bg-dark-secondary transition-all duration-200 rounded-lg mx-2">
                        <ChatListItem key={user._id} data={user} isContactPage={true} />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })
      }
    </div>
  </div>;
}

export default ContactsList;
