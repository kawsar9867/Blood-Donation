import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  user: {
    additionalFields: {
      bloodGroup: {
        default: "Not Selected",
      },
      district: {
        default: "Not Selected",
      },
      upazila: {
        default: "Not Selected",
      },
      role: {
        default: "donor",
      },
      status: {
        default: "active",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: user.role || "donor",
              status: user.status || "Active",
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECTET,
    },
  },
});
