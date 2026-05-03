import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  signup: async (formData) => {
    const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
    set({ user: res.data.user, token: res.data.token });
    localStorage.setItem("token", res.data.token);
    return res.data;
  },

  login: async (formData) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", formData);
    set({ user: res.data.user, token: res.data.token });
    localStorage.setItem("token", res.data.token);
    return res.data;
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;