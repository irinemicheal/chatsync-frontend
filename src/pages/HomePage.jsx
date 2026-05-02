import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <ChatWindow selectedUser={selectedUser} />
    </div>
  );
};

export default HomePage;