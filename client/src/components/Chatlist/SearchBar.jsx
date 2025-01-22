import React from "react";
import { BiSearch } from "react-icons/bi";
import {BsFilter} from "react-icons/bs";

function SearchBar() {
  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearch className="text-white cursor-pointer text-xl"/>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
            // onChange={(e) => console.log(e.target.value)}
          />
        </div>
      </div>
      <div className="pr-5 pl-3 ">
        <BsFilter className="text-white cursor-pointer text-xl" title="Filter"/>
      </div>
    </div>
  );
}

export default SearchBar;
