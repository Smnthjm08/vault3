"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import MnemonicCard from "./mnemonic-card";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useRouter } from "next/navigation";

interface GenerateWalletResult {
  blockIndex: number;
  mnemonic: string;
  walletIndex: number;
  walletKey: string;
}

export default function WalletGenerator() {
  const [wallets, setWallets] = useState<GenerateWalletResult[]>([]);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [walletType, setWalletType] = useState<number | undefined>(undefined);

  const router = useRouter();

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

  const generateWalletFromMnemonics = (
    blockIndex: number | undefined,
    mnemonic: string,
    walletIndex: number,
  ): GenerateWalletResult => {
    if (!blockIndex) {
      throw new Error("Block index is required");
    }
    
    const seed = mnemonicToSeedSync(mnemonic);
    const seedHex = seed.toString("hex");

    return {
      blockIndex,
      mnemonic,
      walletIndex,
      walletKey: seedHex,
    };
  };

  const generateWallet = () => {
    if (!mnemonic) {
      // If no mnemonic, generate one
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
      return;
    }
    
    if (!validateMnemonic(mnemonic)) {
      console.error("Invalid mnemonic");
      router.push("/");
      return;
    }
    
    try {
      // Generate wallet from mnemonic
      const newWallet = generateWalletFromMnemonics(
        walletType,
        mnemonic,
        wallets.length
      );
      
      // Log the wallet key (as requested)
      console.log("Generated wallet key:", newWallet.walletKey);
      
      // Add the new wallet to the list
      setWallets([...wallets, newWallet]);
    } catch (error) {
      console.error("Error generating wallet:", error);
    }
  };

  const mnemonicCardprops = {
    mnemonic: mnemonic,
    onRegenerateMnemonic: () => {
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
    },
  };

  const clearWallets = () => {
    setWallets([]);
  };

  return (
    <main>
      {mnemonic === "" && (
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
              <AccordionTrigger className="px-4 py-3 pl-8 text-lg font-bold">
                Your Wallet Secret Phrase
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <MnemonicCard {...mnemonicCardprops} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      {mnemonic && (
        <div className="container mx-auto px-4 pt-8 max-w-4xl flex justify-end gap-2">
          <Button onClick={() => generateWallet()}>
            Create Wallet
          </Button>
          <Button 
            variant={"destructive"} 
            className="bg-red-600/50"
            onClick={() => clearWallets()}
          >
            Clear Wallets
          </Button>
        </div>
      )}
      
      {wallets.length > 0 && (
        <div className="container mx-auto px-4 pt-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Generated Wallets</h2>
          <div className="border rounded-lg shadow-sm p-4">
            <ul>
              {wallets.map((wallet, index) => (
                <li key={index} className="mb-2 p-2 border-b">
                  <p><strong>Wallet #{index + 1}</strong> ({wallet.blockIndex === 60 ? 'Ethereum' : 'Solana'})</p>
                  <p className="text-sm text-gray-600 break-all">
                    Key: {wallet.walletKey.substring(0, 20)}...
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}