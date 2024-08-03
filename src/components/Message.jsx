import React, { useContext, useRef, useEffect } from "react";
import { AuthContext } from "./Context/AuthContext";
import { ChatContext } from "./Context/ChatContext";

export const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  const { data } = useContext(ChatContext);
  // console.log(message);
  return (
    <div
      ref={ref}
      className={`message ${
        message.senderId === currentUser.uid && "owner"
      }  flex  space-y-4 gap-2 mb-0 `}
    >
      <div className="messageInfo ml-2 text-center mt-8">
        <img
          className="w-[40px] h-[40px] object-cover ml-2 rounded-[50%] "
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span className="text-[14px]  ">just now</span>
      </div>
      <div className="messageContent  flex flex-col ">
        <p className="bg-bg2 w-auto flex flex-wrap p-2 rounded-md">
          {" "}
          {message.text}{" "}
        </p>
        {message.img && <img src={message.img} alt="" className="" />}
      </div>
    </div>
  );
};













