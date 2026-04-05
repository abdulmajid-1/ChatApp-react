import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div
      className="w-full h-screen flex items-stretch"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        className={`w-full h-full grid ${
          selectedUser
            ? "md:grid-cols-[280px_1fr_240px] xl:grid-cols-[300px_1fr_260px]"
            : "md:grid-cols-[300px_1fr]"
        }`}
        style={{ overflow: "hidden" }}
      >
        <Sidebar />
        <ChatContainer />
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;
