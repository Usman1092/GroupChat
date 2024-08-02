import React, { useContext, useState, useEffect } from "react";
import { Message } from "./Message";
import { ChatContext } from "./Context/ChatContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

export const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.chatId) return;

    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [data.chatId]);

  useEffect(() => {
    if (!data.groupId) return;

    const unsub = onSnapshot(doc(db, "groups", data.groupId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [data.groupId]);

  return (
    <div className="messages flex-grow bg-[#ddddf7]">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};
