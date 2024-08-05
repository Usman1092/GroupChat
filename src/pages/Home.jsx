import React from "react";
import { SideBar } from "../components/SideBar";
import Chat from "../components/Chat";
import {v4 as uuid} from 'uuid';

export const Home = () => {
  const groupId=uuid();
  console.log(groupId);
  return (
    <div className="home flex justify-center bg-[#a7bcff] h-[100vh] items-center">
      <div className="container flex border rounded-md border-[#fff] overflow-hidden h-[500px] ">
        <SideBar />
        <Chat />
      
      </div>
    </div>
  );
};
