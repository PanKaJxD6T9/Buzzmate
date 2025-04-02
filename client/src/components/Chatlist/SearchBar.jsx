import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";

function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [{ contactSearch }, dispatch] = useStateProvider();

  const handleClearInput = () => {
    dispatch({ 
      type: reducerCases.SET_CONTACT_SEARCH, 
      contactSearch: "" 
    });
  };

  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3">
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
            value={contactSearch}
            placeholder="Search or start new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full placeholder:text-gray-300"
            onChange={(e) => dispatch({ type: reducerCases.SET_CONTACT_SEARCH, contactSearch: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {contactSearch && (
            <button
              onClick={handleClearInput}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-green-500 transition-colors duration-300"
            >
              <IoCloseOutline className="text-xl" />
            </button>
          )}
        </div>
      </div>
      <div className="pr-5 pl-3">
        <BsFilter 
          className="text-white cursor-pointer text-xl hover:text-green-500 transition-colors duration-300 hover:scale-110" 
          title="Filter"
        />
      </div>
    </div>
  );
}

export default SearchBar;
