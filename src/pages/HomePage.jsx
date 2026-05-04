import { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import useAuthStore from "../store/useAuthStore";
import useSocketStore from "../store/useSocketStore";

const HomePage = () => {
  const { user } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();
  const connected = useRef(false);

  useEffect(() => {
    if (user && !connected.current) {
      connected.current = true;
      connectSocket(user.id);
    }
    return () => {
      disconnectSocket();
      connected.current = false;
    };
  }, [user]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default HomePage;