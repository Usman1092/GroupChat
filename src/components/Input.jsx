import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "./Context/AuthContext";
import { ChatContext } from "./Context/ChatContext";
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!data.chatId || !currentUser) {
      console.error("Missing chatId or currentUser");
      return;
    }

    try {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress monitoring if needed
          },
          (error) => {
            console.error("Upload error:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await sendMessage(downloadURL);
          }
        );
      } else {
        await sendMessage();
      }

      setText("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendMessage = async (downloadURL = null) => {
    const messageData = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      ...(downloadURL && { img: downloadURL }),
    };

    const chatRef = doc(db, "chats", data.chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, { messages: [] });
    }

    await updateDoc(chatRef, {
      messages: arrayUnion(messageData),
    });

    await updateUserChats(messageData);
  };

  const updateUserChats = async (messageData) => {
    try {
      const chatUpdateData = {
        [`${data.chatId}.lastMessage`]: {
          text: messageData.text,
        },
        [`${data.chatId}.date`]: Timestamp.now(),
      };

      if (data.user.uid) {
        await updateDoc(doc(db, "userChats", currentUser.uid), chatUpdateData);
        await updateDoc(doc(db, "userChats", data.user.uid), chatUpdateData);
      } else if (data.group.groupId) {
        for (const member of data.group.members) {
          await updateDoc(doc(db, "userGroups", member.uid), chatUpdateData);
        }
      }
    } catch (error) {
      console.error("Error updating user chats:", error);
    }
  };

  return (
    <div className="input flex items-center justify-between h-[50px] bg-[#fff] text-[#333] p-[10px]">
      <input
        type="text"
        placeholder="some text...."
        onChange={(e) => setText(e.target.value)}
        value={text}
        className="outline-none w-[100%] text-xl border-none"
      />
      <div className="send flex items-center gap-2">
        <img src={Attach} alt="attach" className="h-[24px] cursor-pointer" />
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="send img" className="cursor-pointer" />
        </label>
        <button
          onClick={handleSend}
          className="bg-[#8da4f1] text-[#fff] rounded-[20%] p-[5px]"
        >
          send
        </button>
      </div>
    </div>
  );
};
