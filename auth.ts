import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials.email) {
          throw new Error("Email required");
        } else if (!credentials.password) {
          throw new Error("Password required");
        }

        const user = await Prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || user.password !== credentials.password) {
          throw new Error("Invalid credentials.");
        }
        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt", // Use JWT for sessions
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  useSecureCookies: process.env.NODE_ENV === "production",
});
