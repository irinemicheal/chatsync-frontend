import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const HomePage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default HomePage;