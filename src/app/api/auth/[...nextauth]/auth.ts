import { getServerSession } from "next-auth";
import type { NextAuthOptions, Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        // Dev-only: allow login if the user exists by email
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        return user ?? null;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) {
        (token as JWT & { role?: string }).role = (user as User & { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session as Session & { user: Session["user"] & { role?: string } }).user = {
        ...session.user,
        role: (token as JWT & { role?: string }).role,
      };
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export function getSession() {
  return getServerSession(authOptions);
}
