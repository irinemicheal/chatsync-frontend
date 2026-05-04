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
      [user.id.toString()]: 0,
    },
  }));
},

  incrementUnread: (senderId) => {
    const { selectedUser } = get();
    // Only increment if this sender is NOT the currently open chat
    if (!selectedUser || selectedUser.id !== senderId) {
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [senderId]: (state.unreadCounts[senderId] || 0) + 1,
        },
      }));
    }
  },

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

  fetchSharedMedia: async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/messages/media/${userId}`, {
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
        "http://localhost:5000/api/messages/send",
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

  // Normalize senderId to string
  const senderId = typeof message.senderId === "object"
    ? message.senderId?._id?.toString() || message.senderId?.toString()
    : message.senderId?.toString();

  console.log("addMessage called - senderId:", senderId);
  console.log("selectedUser:", selectedUser?.id);

  // Add to messages if this chat is open
  if (selectedUser && selectedUser.id === senderId) {
    set({ messages: [...get().messages, message] });
  } else {
    // Increment unread for sender
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