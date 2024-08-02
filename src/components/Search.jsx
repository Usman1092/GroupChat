//search group and username
import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "./Context/AuthContext";
import { ChatContext } from "./Context/ChatContext";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    setErr(false);
    const usersQuery = query(
      collection(db, "users"),
      where("displayName", "==", searchTerm)
    );
    const groupsQuery = query(
      collection(db, "groups"),
      where("name", "==", searchTerm)
    );

    try {
      const [userDocs, groupDocs] = await Promise.all([
        getDocs(usersQuery),
        getDocs(groupsQuery),
      ]);

      const userResults = userDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: "user",
      }));
      const groupResults = groupDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: "group",
      }));

      const allResults = [...userResults, ...groupResults];
      setResults(allResults);

      if (allResults.length === 0) {
        setErr(true);
      }
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async (result) => {
    if (result.type === "user") {
      // Handle user selection logic
      const combinedId =
        currentUser.uid > result.id
          ? currentUser.uid + result.id
          : result.id + currentUser.uid;

      try {
        const res = await getDoc(doc(db, "chats", combinedId));

        if (!res.exists()) {
          // Create a chat in chats collection
          await setDoc(doc(db, "chats", combinedId), { messages: [] });

          // Create user chats
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [`${combinedId}.userInfo`]: {
              uid: result.id,
              displayName: result.displayName,
              photoURL: result.photoURL,
            },
            [`${combinedId}.date`]: serverTimestamp(),
          });

          await updateDoc(doc(db, "userChats", result.id), {
            [`${combinedId}.userInfo`]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [`${combinedId}.date`]: serverTimestamp(),
          });
        }
      } catch (err) {
        console.error("Error handling user selection:", err);
      }
    } else if (result.type === "group") {
      // Handle group selection logic
      // For now, we can just log the group selection
      console.log("Selected group:", result);
    }

    setResults([]);
    setSearchTerm("");
    // dispatch({ type: "CHANGE_USER", payload: { ...result, chatId: combinedId, isGroup: result.isGroup } });
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user or group"
          onKeyDown={handleKey}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          className=" ml-2 bg-[#3e3c61] text-[#fff] border-none   outline-none"
        />
      </div>
      {err && <span>User or group not found!</span>}
      {results.length > 0 && (
        <div className="searchResults">
          {results.map((result, index) => (
            <div
              key={index}
              className="searchResultItem flex items-center pb-2 gap-2 cursor-pointer hover:bg-[#2f2d52]"
              onClick={() => handleSelect(result)}
            >
              {result.type === "user" ? (
                <>
                  <img
                    src={result.photoURL}
                    alt=""
                    className="w-[50px] h-[50px] rounded-[50%] mt-4"
                  />
                  <div className="userChatInfo">
                    <span className="span text-[#fff]">
                      {result.displayName}
                    </span>
                  </div>
                </>
              ) : (
                <div className="groupChatInfo">
                  <span className="span text-[#fff]">{result.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
