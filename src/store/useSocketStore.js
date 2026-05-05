import { create } from "zustand";
import { io } from "socket.io-client";
import useChatStore from "./useChatStore";

let socketInstance = null;

const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (userId) => {
    if (socketInstance?.connected) {
      console.log("Already connected, skipping...");
      return;
    }

    console.log("Connecting socket for userId:", userId);
    socketInstance = io("https://chatsync-backend-jkpd.onrender.com");

    socketInstance.on("connect", () => {
      console.log("Socket connected! ID:", socketInstance.id);
      socketInstance.emit("userOnline", userId);
    });

    socketInstance.on("onlineUsers", (users) => {
      console.log("Online users:", users);
      set({ onlineUsers: users });
    });

    socketInstance.on("receiveMessage", (message) => {
      console.log("🔔 RECEIVED MESSAGE:", message);
      useChatStore.getState().addMessage(message);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected!");
    });

    set({ socket: socketInstance });
  },

  disconnectSocket: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
    set({ socket: null, onlineUsers: [] });
  },
}));

export default useSocketStore;