import create from "zustand";
import {Services} from '../services/services'


const getLocalStorageValue = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || ""
  } else {
    return ""
  }
}

 const useAuthStore = create((set) => ({
    token: {
      accessToken: getLocalStorageValue('accessToken'),
      refreshToken: getLocalStorageValue('refreshToken'),
    },
    user: null,
    setToken: ({ accessToken, refreshToken }) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      set({ token: { accessToken, refreshToken } });
    },
    clearToken: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        token: {
          accessToken: "",
          refreshToken: "",
        },
      });
    },
    setUser: async () => {
      try {
        const user = (await Services.getUser())?.data;
        set({ user: user });
      } catch (error) {
        console.log(error);
      }
    },
  }));


export default useAuthStore;
