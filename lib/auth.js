import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017",
);
const db = client.db("tutorSphereDB");

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "localhost:3001",
      "localhost:3002",
      "tutor-booking-system-blond.vercel.app",
    ],
    protocol: process.env.NODE_ENV === "development" ? "http" : "https",
  },
  advanced: {
    trustedProxyHeaders: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_SECTET || "mock-google-client-secret",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: user.role || "student",
            },
          };
        },
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
