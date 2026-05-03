import { create } from "zustand";

const useChatStore = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),

  conversations: {
    1: [
      { id: 1, text: "Hey! How are you?", fromMe: false, time: "10:01 AM" },
      { id: 2, text: "I'm good! What about you?", fromMe: true, time: "10:02 AM" },
    ],
    2: [
      { id: 1, text: "See you later!", fromMe: false, time: "9:00 AM" },
    ],
    3: [
      { id: 1, text: "Sounds good!", fromMe: false, time: "8:00 AM" },
    ],
    4: [
      { id: 1, text: "Ok cool", fromMe: false, time: "7:00 AM" },
    ],
  },

  addMessage: (userId, message) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [userId]: [...(state.conversations[userId] || []), message],
      },
    })),
}));

export default useChatStore;