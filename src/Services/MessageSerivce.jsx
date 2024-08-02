// import { db } from "../firebase";
// import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";

// export const sendMessage = async (groupId, message, currentUser) => {
//   try {
//     const groupRef = doc(db, "groups", groupId);
//     const messagesRef = collection(groupRef, "messages");

//     const newMessage = {
//       text: message,
//       senderId: currentUser.uid,
//       date: serverTimestamp(),
//     };

//     // Add the new message to the group's messages subcollection
//     await addDoc(messagesRef, newMessage);

//     // Update the last message info in the group's main document
//     await updateDoc(groupRef, {
//       lastMessage: newMessage,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };



// import { db } from "../firebase";
// import {doc, addDoc, collection, serverTimestamp } from "firebase/firestore";

// const sendMessageToGroup = async (groupId, message, currentUser) => {
//   try {
//     const groupRef = doc(db, "groups", groupId);
//     const messagesRef = collection(groupRef, "messages");

//     const newMessage = {
//       text: message,
//       senderId: currentUser.uid,
//       senderName: currentUser.displayName,
//       date: serverTimestamp(),
//     };

//     // Add the new message to the group's messages subcollection
//     await addDoc(messagesRef, newMessage);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };

// export { sendMessageToGroup };






// import { db } from "../firebase";
// import { addDoc, collection,doc, serverTimestamp } from "firebase/firestore";

// const sendMessageToGroup = async (groupId, message, currentUser) => {
//   if (!groupId || !message || !currentUser) {
//     console.error("Invalid parameters for sendMessageToGroup", { groupId, message, currentUser });
//     return;
//   }

//   try {
//     const groupRef = doc(db, "groups", groupId);
//     const messagesRef = collection(groupRef, "messages");

//     const newMessage = {
//       text: message,
//       senderId: currentUser.uid,
//       senderName: currentUser.displayName,
//       date: serverTimestamp(),
//     };

//     // Add the new message to the group's messages subcollection
//     await addDoc(messagesRef, newMessage);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };

// export { sendMessageToGroup };











import { db } from "../firebase";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";

const sendMessageToGroup = async (groupId, content, currentUser, isImage = false) => {
  if (!groupId || !content || !currentUser) {
    console.error("Invalid parameters for sendMessageToGroup", { groupId, content, currentUser });
    return;
  }

  try {
    const groupRef = doc(db, "groups", groupId);
    const messagesRef = collection(groupRef, "messages");

    const newMessage = {
      text: isImage ? null : content,
      imageUrl: isImage ? content : null,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      date: serverTimestamp(),
    };

    // Add the new message to the group's messages subcollection
    await addDoc(messagesRef, newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export { sendMessageToGroup };



