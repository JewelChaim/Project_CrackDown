import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type SessionWithRole = Session & { user: Session["user"] & { role?: string } };

export function getSession() {
  return getServerSession(authOptions) as Promise<SessionWithRole | null>;
}

export async function requireAdmin(): Promise<SessionWithRole> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return session;
}

