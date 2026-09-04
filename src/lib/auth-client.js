import { createAuthClient } from "better-auth/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_URL = API_URL.endsWith("/api")
  ? API_URL.replace(/\/api$/, "")
  : API_URL;

export const authClient = createAuthClient({
  baseURL: SERVER_URL,
});

export const { signIn, signUp, useSession, signOut } = authClient;
