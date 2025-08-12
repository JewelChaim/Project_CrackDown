import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export function getSession() {
  return getServerSession(authOptions);
}
