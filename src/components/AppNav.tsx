import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { buttonVariants } from "./ui/Button";

export default async function AppNav() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-brand to-brand-dark shadow-md">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/jewel-logo.svg" alt="Jewel Healthcare" width={180} height={36} priority />
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {role === "ADMIN" && (
                <Link href="/admin" className={buttonVariants("secondary")}>
                  Admin
                </Link>
              )}
              <Link href="/api/auth/signout" className={buttonVariants("secondary")}>
                Sign out
              </Link>
            </>
          ) : (
            <Link href="/login" className={buttonVariants("primary")}>
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
