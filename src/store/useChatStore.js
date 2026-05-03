import { create } from "zustand";
import axios from "axios";

const useChatStore = create((set, get) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  messages: [],

  fetchMessages: async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ messages: res.data });
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  },

  sendMessage: async (receiverId, text) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/messages/send",
        { receiverId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ messages: [...get().messages, res.data] });
      return res.data;
    } catch (error) {
      console.log("Error sending message:", error);
    }
  },

  addMessage: (message) => {
    set({ messages: [...get().messages, message] });
  },
}));

export default useChatStore;