"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { GithubIcon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 w-full border-b-2 border-white/20 bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.svg" alt="Vault3 logo" height={28} width={28} />
          <span className="text-xl font-extrabold">Vault3</span>
        </Link>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
            <Link href="https://github.com/Smnthjm08/vault3" target="_blank">
          <Button className="rounded-full text-primary font-semibold" variant={"secondary"}>
            <GithubIcon width={"24"} height={"24"}/>
              Github
          </Button>
            </Link>
        </div>
      </div>
    </nav>
  );
}
