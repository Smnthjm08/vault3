"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import MnemonicCard from "./mnemonic-card";
import { generateMnemonic } from "bip39";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function WalletGenerator() {
  //   const [wallets, setWallets] = useState<string[]>([]);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [walletType, setWalletType] = useState<number | undefined>(undefined);

  const generateMnemonics = (value: number) => {
    try {
      if (value === 501) {
        setWalletType(501);
      } else if (value === 60) {
        setWalletType(60);
      }
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
    } catch (errors) {
      console.log("errors", errors);
    }
  };

  const mnemonicCardprops = {
    mnemonic: mnemonic,
    onRegenerateMnemonic: () => {
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
    },
  };

  return (
    <main>
      {mnemonic === "" && (
        // {wallet.length === 0 && (
        <section className="flex flex-col items-center min-h-screen justify-center text-center px-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create Your Web3 Wallet Instantly
          </h1>

          <p className="leading-7 mt-6 text-muted-foreground max-w-xl">
            Create a secure Solana or Ethereum wallet instantly. No sign-ups,
            just you and your keys.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <Button
              className="font-semibold"
              onClick={() => generateMnemonics(60)}
              size={"lg"}
            >
              Ethereum{" "}
              <Image
                width={16}
                height={16}
                alt="Ethereum logo"
                src="ethereum.svg"
              />
            </Button>
            <Button
              className="font-semibold"
              onClick={() => generateMnemonics(501)}
              size={"lg"}
            >
              Solana{" "}
              <Image
                width={16}
                height={16}
                alt="Solana logo"
                src="solana.svg"
              />
            </Button>
          </div>
        </section>
      )}
      {walletType !== undefined && mnemonic && (
        <div className="container mx-auto px-4 pt-8 max-w-4xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="item-1"
              className="border rounded-lg shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 pl-8 text-lg font-medium">
                Your Wallet Secret Phrase
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <MnemonicCard {...mnemonicCardprops} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </main>
  );
}
