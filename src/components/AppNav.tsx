import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AppNav() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <header className="sticky top-0 z-40 grad-hero border-b border-panel">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/jewel-logo.svg" alt="Jewel Healthcare" width={180} height={36} priority />
        </Link>
        <div className="flex items-center gap-5 text-sm">
          {role === "ADMIN" && <Link href="/admin" className="hover:underline">Admin</Link>}
          <Link href="/api/auth/signout" className="hover:underline">Sign out</Link>
        </div>
      </nav>
    </header>
  );
}
