import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export function getSession() {
  return getServerSession(authOptions);
}

