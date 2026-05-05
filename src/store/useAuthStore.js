import { create } from "zustand";
import axios from "axios";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,

  signup: async (formData) => {
    const res = await axios.post("https://chatsync-backend-jkpd.onrender.com/api/auth/signup", formData);
    const user = {
      id: res.data.user.id,
      fullName: res.data.user.fullName,
      email: res.data.user.email,
      profilePic: res.data.user.profilePic || "",
      bio: res.data.user.bio || "",
    };
    set({ user, token: res.data.token });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(user));
    return res.data;
  },

  login: async (formData) => {
    const res = await axios.post("https://chatsync-backend-jkpd.onrender.com/api/auth/login", formData);
    const user = {
      id: res.data.user.id,
      fullName: res.data.user.fullName,
      email: res.data.user.email,
      profilePic: res.data.user.profilePic || "",
      bio: res.data.user.bio || "",
    };
    set({ user, token: res.data.token });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(user));
    return res.data;
  },

  updateProfile: async (formData) => {
    const token = localStorage.getItem("token");
    const res = await axios.put("https://chatsync-backend-jkpd.onrender.com/api/auth/update", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedUser = {
      id: res.data.id || res.data._id,
      fullName: res.data.fullName,
      email: res.data.email,
      bio: res.data.bio || "",
      profilePic: res.data.profilePic || "",
    };
    set({ user: updatedUser });
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  },

  deleteAccount: async () => {
    const token = localStorage.getItem("token");
    await axios.delete("https://chatsync-backend-jkpd.onrender.com/api/auth/delete", {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signup";
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
}));

export default useAuthStore;