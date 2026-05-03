import { create } from "zustand";
import { io } from "socket.io-client";

const useSocketStore = create((set, get) => ({
  socket: null,

  connectSocket: (userId) => {
    const socket = io("http://localhost:5000");
    socket.on("connect", () => {
      socket.emit("userOnline", userId);
      console.log("Socket connected!");
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