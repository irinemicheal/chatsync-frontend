import { create } from "zustand";
import { io } from "socket.io-client";
import useChatStore from "./useChatStore";

const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (userId) => {
    const existing = get().socket;
    if (existing?.connected) {
      console.log("Socket already connected, skipping...");
      return;
    }

    console.log("Connecting socket for userId:", userId);
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Socket connected! ID:", socket.id);
      console.log("Emitting userOnline with userId:", userId);
      socket.emit("userOnline", userId);
    });

    socket.on("onlineUsers", (users) => {
      console.log("Online users updated:", users);
      set({ onlineUsers: users });
    });

    socket.on("receiveMessage", (message) => {
      console.log("🔔 RECEIVED MESSAGE:", message);
      useChatStore.getState().addMessage(message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected!");
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));

export default useSocketStore;