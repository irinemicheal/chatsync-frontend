import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import useAuthStore from "../store/useAuthStore";
import useSocketStore from "../store/useSocketStore";

const HomePage = () => {
  const { user } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    if (user) connectSocket(user.id);
    return () => disconnectSocket();
  }, [user]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default HomePage;