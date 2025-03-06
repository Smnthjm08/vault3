"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { GithubIcon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 w-full border-b bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.svg" alt="Vault3 logo" height={28} width={28} />
          <span className="text-xl font-extrabold">Vault3</span>
        </Link>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button className="rounded-full text-primary font-semibold" variant={"secondary"}>
            <GithubIcon width={"24"} height={"24"}/>
            <Link href="https://github.com/smnthjm08/valut3" target="_blank">
              Github
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
