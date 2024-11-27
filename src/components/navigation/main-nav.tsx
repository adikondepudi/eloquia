import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";

export function MainNav() {
  return (
    <header className="border-b bg-background">
      <nav className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="font-bold">
          Analytics Dashboard
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/upload" className="text-sm font-medium">
            Upload
          </Link>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>
    </header>
  );
}