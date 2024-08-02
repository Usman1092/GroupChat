import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./Context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar flex bg-[#03346E] justify-between h-[50px] w-full">
      <span className="span pt-3 ml-2 mr-auto text-[#fff]">Chat</span>
      <div className="user flex justify-end">
        <img
          src={currentUser.photoURL}
          alt=""
          className="w-[24px] h-[24px] mt-3 object-cover rounded-[50%]"
        />
        <span className="ml-1 mr-1 span pt-3 text-[#fff]">
          {currentUser.displayName}
        </span>
        <button
          className=" bg-[#fff] rounded-sm cursor-pointer border-none h-6 mt-3 mr-2"
          onClick={() => signOut(auth)}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
