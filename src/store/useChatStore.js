import { create } from "zustand";
import axios from "axios";

const useChatStore = create((set, get) => ({
  selectedUser: null,
  messages: [],
  sharedMedia: [],
  unreadCounts: {},

  setSelectedUser: (user) => {
    set((state) => ({
      selectedUser: user,
      unreadCounts: {
        ...state.unreadCounts,
        [user.id]: 0,
      },
    }));
  },

  fetchMessages: async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://chatsync-backend-jkpd.onrender.com/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ messages: res.data });
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  },

  fetchSharedMedia: async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://chatsync-backend-jkpd.onrender.com/api/messages/media/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ sharedMedia: res.data });
    } catch (error) {
      console.log("Error fetching media:", error);
    }
  },

  sendMessage: async (receiverId, text, fileUrl = "", fileName = "", fileType = "") => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://chatsync-backend-jkpd.onrender.com/api/messages/send",
        { receiverId, text, fileUrl, fileName, fileType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ messages: [...get().messages, res.data] });
      return res.data;
    } catch (error) {
      console.log("Error sending message:", error);
    }
  },

  addMessage: (message) => {
    const { selectedUser } = get();
    const senderId = message.senderId?._id
      ? message.senderId._id.toString()
      : message.senderId?.toString();

    console.log("addMessage - senderId:", senderId);
    console.log("addMessage - selectedUser.id:", selectedUser?.id);

    if (selectedUser && selectedUser.id === senderId) {
      // Chat is open — add message directly
      set({ messages: [...get().messages, message] });
    } else {
      // Chat not open — increment unread
      console.log("Incrementing unread for:", senderId);
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [senderId]: (state.unreadCounts[senderId] || 0) + 1,
        },
      }));
    }
  },

  updateSelectedUserPic: (profilePic) =>
    set((state) => ({
      selectedUser: state.selectedUser
        ? { ...state.selectedUser, profilePic }
        : null,
    })),
}));

export default useChatStore;