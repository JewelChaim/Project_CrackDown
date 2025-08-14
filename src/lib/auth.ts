import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export interface AppSession extends Session {
  user?: Session["user"] & { role?: string; email?: string | null };
}

export function getSession() {
  return getServerSession(authOptions);
}

export async function ensureAdmin() {
  const session = (await getServerSession(authOptions)) as AppSession | null;
  const role = session?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");
  return session;
}

