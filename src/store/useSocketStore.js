import { create } from "zustand";
import { io } from "socket.io-client";
import useChatStore from "./useChatStore";

const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (userId) => {
    const socket = io("http://localhost:5000");
    socket.on("connect", () => {
      socket.emit("userOnline", userId);
    });

    socket.on("onlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("receiveMessage", (message) => {
      useChatStore.getState().addMessage(message);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({ socket: null });
  },
}));

export default useSocketStore;