// import { createContext, useContext, useReducer } from "react";
// import { AuthContext } from "./AuthContext";

// export const ChatContext = createContext();

// export const ChatContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);

//   const INITIAL_STATE = {
//     chatId: "null",
//     user: {},
//   };

//   const chatReducer = (state, action) => {
//     switch (action.type) {
//       case "CHANGE_USER":
//         const chatId =
//           currentUser.uid > action.payload.uid
//             ? currentUser.uid + action.payload.uid
//             : action.payload.uid + currentUser.uid;
//         console.log("ChatContext CHANGE_USER:", {
//           chatId,
//           user: action.payload,
//         });
//         return {
//           user: action.payload,
//           chatId,
//         };
//       default:
//         return state;
//     }
//   };

//   const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

//   return (
//     <ChatContext.Provider value={{ data: state, dispatch }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };






// import { createContext, useContext, useReducer } from "react";
// import { AuthContext } from "./AuthContext";

// export const ChatContext = createContext();

// export const ChatContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);

//   const INITIAL_STATE = {
//     chatId: "null",
//     user: {},
//     group: {},
//   };

//   const chatReducer = (state, action) => {
//     switch (action.type) {
//       case "CHANGE_USER":
//         const userChatId =
//           currentUser.uid > action.payload.uid
//             ? currentUser.uid + action.payload.uid
//             : action.payload.uid + currentUser.uid;
//         console.log("ChatContext CHANGE_USER:", {
//           chatId: userChatId,
//           user: action.payload,
//           group: {},
//         });
//         return {
//           ...state,
//           user: action.payload,
//           group: {},
//           chatId: userChatId,
//         };
//       case "CHANGE_GROUP":
//         const groupChatId = action.payload.groupId;
//         console.log("ChatContext CHANGE_GROUP:", {
//           chatId: groupChatId,
//           group: action.payload,
//           user: {},
//         });
//         return {
//           ...state,
//           user: {},
//           group: action.payload,
//           chatId: groupChatId,
//         };
//       default:
//         return state;
//     }
//   };

//   const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

//   return (
//     <ChatContext.Provider value={{ data: state, dispatch }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };











// import { createContext, useContext, useReducer } from "react";
// import { AuthContext } from "./AuthContext";


// export const ChatContext = createContext();

// export const ChatContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);

//   // Default state with proper initialization
//   const INITIAL_STATE = {
//     chatId: "null",
//     user: {},
//     group: {
//       groupId: "",
//       members: [], // Default to empty array
//     },
//   };

//   const chatReducer = (state, action) => {
//     switch (action.type) {
//       case "CHANGE_USER":
//         const userChatId =
//           currentUser.uid > action.payload.uid
//             ? currentUser.uid + action.payload.uid
//             : action.payload.uid + currentUser.uid;
//         console.log("ChatContext CHANGE_USER:", {
//           chatId: userChatId,
//           user: action.payload,
//           group: state.group, // Maintain previous group state
//         });
//         return {
//           ...state,
//           user: action.payload,
//           group: INITIAL_STATE.group, // Reset group to default state
//           chatId: userChatId,
//         };
//       case "CHANGE_GROUP":
//         const groupChatId = action.payload.groupId || ""; // Default to empty string if groupId is missing
//         console.log("ChatContext CHANGE_GROUP:", {
//           chatId: groupChatId,
//           group: action.payload,
//           user: state.user, // Maintain previous user state
//         });
//         return {
//           ...state,
//           user: INITIAL_STATE.user, // Reset user to default state
//           group: {
//             groupId: groupChatId,
//             members: action.payload.members || [], // Default to empty array if members are missing
//           },
//           chatId: groupChatId,
//         };
//       default:
//         return state;
//     }
//   };

//   const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

//   return (
//     <ChatContext.Provider value={{ data: state, dispatch }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };






//upload photo for group

import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // Default state with proper initialization
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
    group: {
      groupId: "",
      members: [], // Default to empty array
      groupPhotoURL: "", // Add groupPhotoURL to the initial state
    },
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        const userChatId =
          currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid;
        console.log("ChatContext CHANGE_USER:", {
          chatId: userChatId,
          user: action.payload,
          group: INITIAL_STATE.group, // Reset group to default state
        });
        return {
          ...state,
          user: action.payload,
          group: INITIAL_STATE.group, // Reset group to default state
          chatId: userChatId,
        };
      case "CHANGE_GROUP":
        const groupChatId = action.payload.groupId || ""; // Default to empty string if groupId is missing
        console.log("ChatContext CHANGE_GROUP:", {
          chatId: groupChatId,
          group: action.payload,
          user: state.user, // Maintain previous user state
          
        });
        return {
          ...state,
          user: INITIAL_STATE.user, // Reset user to default state
          group: {
            groupId: groupChatId,
            members: action.payload.members || [], // Default to empty array if members are missing
            groupPhotoURL: action.payload.groupPhotoURL || "", // Add groupPhotoURL
          },
          chatId: groupChatId,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
