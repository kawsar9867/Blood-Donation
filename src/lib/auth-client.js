import { createAuthClient } from "better-auth/react";

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://assingment-10-server.vercel.app/api";
  }
  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();
const SERVER_URL = API_URL.endsWith("/api")
  ? API_URL.replace(/\/api$/, "")
  : API_URL;

export const authClient = createAuthClient({
  baseURL: SERVER_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession, signOut } = authClient;
