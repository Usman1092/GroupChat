import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { AuthContext } from "./Context/AuthContext";
import { ChatContext } from "./Context/ChatContext";
import CreateGroup from "./groupCreate"; // Import the CreateGroup component

const Chats = () => {
  const [chats, setChats] = useState({});
  const [showCreateGroup, setShowCreateGroup] = useState(false); // State to show/hide the CreateGroup component
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsubUserChats = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          console.log("User chats: ", doc.data());
          setChats((prevChats) => ({ ...prevChats, ...doc.data() }));
        }
      );

      const unsubUserGroups = onSnapshot(
        doc(db, "userGroups", currentUser.uid),
        (doc) => {
          console.log("User groups: ", doc.data());
          setChats((prevChats) => ({ ...prevChats, ...doc.data() }));
        }
      );

      return () => {
        unsubUserChats();
        unsubUserGroups();
      };
    };

    if (currentUser.uid) {
      getChats();
    }
  }, [currentUser.uid]);

  console.log(Object.entries(chats));

  const handleSelect = async (chat) => {
    if (chat.userInfo) {
      dispatch({ type: "CHANGE_USER", payload: chat.userInfo });
    } else if (chat.groupId) {
      const groupId = chat.groupId;
      const groupData = await getDoc(doc(db, "groups", groupId));
      if (groupData.exists()) {
        dispatch({
          type: "CHANGE_GROUP",
          payload: { ...groupData.data(), id: groupId },
        });
      }
      console.log("Selected group:", chat);
    }
  };

  return (
    <div className="chats overflow-y-scroll">
      <button
        className="bg-tb text-[#fff] p-2 rounded mb-0 mt-2"
        onClick={() => setShowCreateGroup(!showCreateGroup)}
      >
        {showCreateGroup ? "Close Group Creation" : "Create Group"}
      </button>

      {showCreateGroup && <CreateGroup />}

      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            key={chat[0]}
            onClick={() => handleSelect(chat[1])}
            className="userChat mt-4 flex flex-row items-center pb-2 gap-2 cursor-pointer hover:bg-[#2f2d52]"
          >
            <img
              src={
                chat[1].userInfo
                  ? chat[1].userInfo.photoURL
                  : chat[1].groupPhotoURL
              }
              alt="User"
              className="rounded-[50%] w-[30px] h-[30px]"
            />
            <div className="userChatInfo">
              <span className="font-bold text-[#fff]">
                {chat[1].userInfo
                  ? chat[1].userInfo.displayName
                  : chat[1].groupName}
              </span>
              <p className="fontsize-sm text-[#fff]">
                {chat[1].lastMessage?.text || "No messages yet"}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
