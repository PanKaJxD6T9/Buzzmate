import React, { useEffect, useRef } from "react";

function ContextMenu({ options, contextMenu, setContextMenu }) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(event.target.id !== "context-opener") {
        if(contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
          setContextMenu(false);
        }
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, [])

  const handleClick = (e, callback) => {
    e.stopPropagation();
    callback();
    setContextMenu(false);
  }

  return (
    <div className={`bg-dropdown-background fixed z-[100] shadow-xl rounded-md overflow-hidden top-[70%] left-[70%] translate-x-[-50%] translate-y-[-50%]`} ref={contextMenuRef}>
      <ul>
        {
          options.map(({ name, callback }) => {
            return (
              <li key={name} onClick={(e) => handleClick(e, callback)} className="px-5 py-2 cursor-pointer hover:bg-background-default-hover">
                <span className="text-white">{name}</span>
              </li>
              ) 
            })
          }
        </ul>
      </div>
  );
}

export default ContextMenu;
