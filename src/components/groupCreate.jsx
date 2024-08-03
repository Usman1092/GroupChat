// upload photo  while creating group
import React, { useState, useContext } from "react";
import { db, storage } from "../firebase";
import {
  setDoc,
  doc,
  serverTimestamp,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "./Context/AuthContext";
import { v4 as uuid } from "uuid";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState(""); // To handle input for new member name
  const [members, setMembers] = useState([]); // This should be a list of user objects {uid, displayName, photoURL}
  const [groupPhoto, setGroupPhoto] = useState(null); // To handle group photo upload
  const { currentUser } = useContext(AuthContext);

  const handleAddMember = async () => {
    if (memberName.trim() === "") return;

    try {
      // Fetch user based on the entered displayName
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("displayName", "==", memberName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const memberData = userDoc.data();
        setMembers([
          ...members,
          {
            uid: userDoc.id,
            displayName: memberData.displayName,
            photoURL: memberData.photoURL,
          },
        ]);
        setMemberName(""); // Clear the input after adding
      } else {
        console.log("No such user found!");
        alert("No such user found!");
      }
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || members.length < 1) {
      console.log("Group must have a name and at least 1 other member");
      return;
    }
  
    const groupId = uuid();
    const groupMembers = [
      ...members,
      { uid: currentUser.uid, displayName: currentUser.displayName, photoURL: currentUser.photoURL }
    ];
  
    try {
      let groupPhotoURL = "";
  
      if (groupPhoto) {
        const storageRef = ref(storage, `groupPhotos/${groupId}`);
        const uploadTask = uploadBytesResumable(storageRef, groupPhoto);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progress monitoring if needed
            },
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              groupPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }
  
      // Create the group document in Firestore
      await setDoc(doc(db, "groups", groupId), {
        name: groupName,
        members: groupMembers,
        messages: [],
        groupPhotoURL,
      });
      console.log("Group document created");
  
      for (let member of groupMembers) {
        const userGroupDocRef = doc(db, "userGroups", member.uid);
        await setDoc(userGroupDocRef, {
          [groupId]: {
            groupName,
            groupId,
            date: serverTimestamp(),
            groupPhotoURL,
            isGroup: true, // Mark as group
          },
        }, { merge: true });
        console.log(`Updated userGroups for ${member.uid}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  
    setGroupName("");
    setMembers([]);
    setGroupPhoto(null); // Reset group photo
  };
  
  // const handleCreateGroup = async () => {
  //   if (!groupName || members.length < 1) {
  //     console.log("Group must have a name and at least 1 other member");
  //     return;
  //   }

  //   const groupId = uuid();
  //   const groupMembers = [
  //     ...members,
  //     {
  //       uid: currentUser.uid,
  //       displayName: currentUser.displayName,
  //       photoURL: currentUser.photoURL,
  //     },
  //   ];

  //   try {
  //     let groupPhotoURL = "";

  //     if (groupPhoto) {
  //       const storageRef = ref(storage, `groupPhotos/${groupId}`);
  //       const uploadTask = uploadBytesResumable(storageRef, groupPhoto);
  //       await new Promise((resolve, reject) => {
  //         uploadTask.on(
  //           "state_changed",
  //           (snapshot) => {
  //             // Progress monitoring if needed
  //           },
  //           (error) => {
  //             console.error("Upload error:", error);
  //             reject(error);
  //           },
  //           async () => {
  //             groupPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
  //             resolve();
  //           }
  //         );
  //       });
  //     }

  //     await setDoc(doc(db, "groups", groupId), {
  //       name: groupName,
  //       members: groupMembers,
  //       messages: [],
  //       groupPhotoURL,
  //     });
  //     console.log("Group document created");

  //     for (let member of groupMembers) {
  //       const userGroupDocRef = doc(db, "userGroups", member.uid);
  //       await setDoc(
  //         userGroupDocRef,
  //         {
  //           [groupId]: {
  //             groupName,
  //             groupId,
  //             date: serverTimestamp(),
  //             groupPhotoURL,
  //           },
  //         },
  //         { merge: true }
  //       );
  //       console.log(`Updated userGroups for ${member.uid}`);
  //     }
  //   } catch (error) {
  //     console.error("Error creating group:", error);
  //   }

  //   setGroupName("");
  //   setMembers([]);
  //   setGroupPhoto(null); // Reset group photo
  // };

  return (
    <div className="flex flex-col space-y-2">
      <input
        type="text"
        placeholder="Group Name"
        className="text-[#333] w-[80%] ml-auto mr-auto mt-2"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Member Name"
        className="text-[#333] w-[80%] ml-auto mr-auto rounded-[0%]"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        className="text-[#333] w-[80%] ml-auto mr-auto"
        onChange={(e) => setGroupPhoto(e.target.files[0])}
      />
      <button
        className="bg-tb w-[80%] ml-auto mr-auto rounded-[0%]"
        onClick={handleAddMember}
      >
        Add Member
      </button>
      <button
        className="bg-bg1 w-[80%] ml-auto mr-auto rounded-[0%]"
        onClick={handleCreateGroup}
      >
        Create Group
      </button>
      <div>
        <h3 className="text-[#fff] text-center">Members:</h3>
        <ul>
          {members.map((member, index) => (
            <li key={index}>{member.displayName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateGroup;



