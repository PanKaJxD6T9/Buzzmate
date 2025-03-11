import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
// import { BsFilter } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { calculateTime } from "@/utils/CalculateTime";

function SearchMessages() {

  const [{currentChatUser, messages}, dispatch] = useStateProvider();
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages ] = useState([])

  const handleClearInput = () => {
    setSearchTerm("");
  };

  React.useEffect(() => {
    if(searchTerm){
      setSearchedMessages(messages.filter((message)=>message.type === "text" && message.message.includes(searchTerm)))
    } else {
      setSearchedMessages([])
    }
  }, [searchTerm])


  return <div className="border-white border-l border-1 w-full bg-gray-900 flex flex-col z-10 max-h-screen ">
    <div className="h-16 px-4 py-5 flex gap-10 items-center bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 text-primary-strong">
      <IoClose className="text-2xl cursor-pointer" onClick={() => { dispatch({ type: reducerCases.SET_SEARCH_MESSAGE }) }} />
      <span>Search Messages</span>
    </div>
    <div className="overflow-auto custom-scrollbar">
      <div className="flex items-center flex-col w-full">
        <div className="flex px-5 items-center gap-3 h-14 w-full">
          <div
            className={`bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 flex items-center gap-3 px-3 py-1.5 rounded-lg flex-grow
          transition-all duration-300 ${isFocused ? 'shadow-lg ring-2 ring-green-500' : 'hover:bg-opacity-90'}`}
          >
            <div>
              <BiSearch className={`text-xl transition-colors duration-300 ${isFocused ? 'text-green-500' : 'text-white'} cursor-pointer hover:scale-110`} />
            </div>
            <div className="flex-grow relative">
              <input
                type="text"
                value={searchTerm}
                placeholder="Search Messages"
                className="bg-transparent text-sm focus:outline-none text-white w-full placeholder:text-gray-300"
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {searchTerm && (
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
        <span className="mt-10 text-secondary">
          {!searchTerm.length && `Search For Messages with ${currentChatUser?.name}`}
        </span>
        <div className="flex justify-center h-full flex-col">
          {
            searchTerm.length > 0 && !searchedMessages.length && (
              <span className="text-secondary w-full flex justify-center">No Messages Found</span>
            )
          }
        </div>
        <div className="flex flex-col w-full h-full">
          {
            searchedMessages.map((message) => (
              <div key={message.id} className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[0.1px] border-secondary py-5">
                <div className="text-sm text-secondary ">
                  {calculateTime(message?.createdAt)}
                </div>
                <div className="text-icon-green">{message.message}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  </div>;
}

export default SearchMessages;
