import React, { createContext, useReducer } from "react";

const INITIAL_STATE = {
  user: null,
  chatId: null,
  isGroup: false,
  group: null,
};

const ChatReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_USER":
      if (action.payload && action.payload.uid) {
        return {
          ...state,
          user: action.payload,
          chatId: action.payload.uid,
          isGroup: false,
        };
      } else {
        console.error("Invalid user payload:", action.payload);
        return state;
      }
    case "CHANGE_GROUP":
      if (action.payload && action.payload.id) {
        return {
          ...state,
          group: action.payload,
          chatId: action.payload.id,
          isGroup: true,
        };
      } else {
        console.error("Invalid group payload:", action.payload);
        return state;
      }
    default:
      return state;
  }
};

export const ChatContext = createContext(INITIAL_STATE);

export const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ChatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
