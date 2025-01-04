// frontend/lib/auth.ts

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import GoogleProvider from "next-auth/providers/google";

// Extend the Session and JWT interfaces
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: Date | null;
    };
    accessToken?: string;
  }

  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }

  interface AdapterUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: Date | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, user }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - Account:", account);
      console.log("JWT Callback - User:", user);

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        };

        if (user.email)
          await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
              email: user.email!,
              name: user.name,
              image: user.image,
              emailVerified: user.emailVerified,
            },
          });
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Session:", session);

      session.user = {
        name: token.user?.name ?? null,
        email: token.user?.email ?? null,
        image: token.user?.image ?? null,
        emailVerified: token.user?.emailVerified ?? null,
      };

      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // if (url.startsWith(baseUrl)) return url;
      return baseUrl + '/profile';
    },
  },
};
