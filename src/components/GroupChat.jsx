

import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import { db } from "../firebase";
import { collection, query, onSnapshot, doc } from "firebase/firestore";
import { sendMessageToGroup } from "../Services/MessageSerivce";


const GroupChat = ({ groupId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!groupId) {
      console.error("groupId is not provided");
      return;
    }

    const messagesRef = collection(db, "groups", groupId, "messages");
    const q = query(messagesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let messagesList = [];
      snapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleSend = async () => {
    console.log("Sending message:", { groupId, message, currentUser });
    if (message.trim()) {
      await sendMessageToGroup(groupId, message, currentUser);
      setMessage(""); // Clear the input field after sending the message
    }
  };

  return (
    <div className="groupChat">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <p><strong>{msg.senderName}:</strong> {msg.text}</p>
            <small>{msg.date ? new Date(msg.date.toDate()).toLocaleString() : "Sending..."}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="messageInput mt-2 ml-2"
      />
      <button onClick={handleSend} className="sendButton bg-bg1 ml-10 mt-5 p-2 rounded-[10%]">GroupMsg</button>
    </div>
  );
};

export default GroupChat;
