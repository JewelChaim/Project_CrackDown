import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { User } from "@prisma/client";
import type { JWT } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        return user ?? null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as User).role;
      return token;
    },
    async session({ session, token }) {
      (session.user as typeof session.user & { role?: string }).role = (token as JWT & { role?: string }).role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
