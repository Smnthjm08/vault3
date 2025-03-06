import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen justify-center text-center px-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Create Your Web3 Wallet Instantly
      </h1>

      <p className="leading-7 mt-6 text-muted-foreground max-w-xl">
        Create a secure Solana or Ethereum wallet instantly. No sign-ups, just
        you and your keys.
      </p>

      <div className="flex gap-4 mt-8">
        <Link href="/generate-wallet">
          <Button className="font-semibold" size={"lg"}>
            Ethereum{" "}
            <Image
              width={16}
              height={16}
              alt="Ethereum logo"
              src="ethereum.svg"
            />
          </Button>
        </Link>
        <Link href="/generate-wallet">
          <Button className="font-semibold" size={"lg"}>
            Solana{" "}
            <Image width={16} height={16} alt="Solana logo" src="solana.svg" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
