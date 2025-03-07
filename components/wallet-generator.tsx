"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import MnemonicCard from "./mnemonic-card";
import { derivePath } from "ed25519-hd-key";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Keypair } from '@solana/web3.js';
import { ethers } from 'ethers';
import { Badge } from "./ui/badge";
import { Eye } from "lucide-react";

interface GenerateWalletResult {
  blockIndex: number;
  mnemonic: string;
  walletIndex: number;
  privateKey: string;
  publicKey: string;
  walletAddress: string;
}

export default function WalletGenerator() {
  const [wallets, setWallets] = useState<GenerateWalletResult[]>([]);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [walletType, setWalletType] = useState<number | undefined>(undefined);
  const [copied, setCopied] = useState<number | null>(null);

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
    walletIndex: number
  ): GenerateWalletResult => {
    if (!blockIndex) {
      throw new Error("Block index is required");
    }

    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/${blockIndex}'/${walletIndex}'/0'`;
    console.log("Path:", path);

    // Solana (501)
    if (blockIndex === 501) {
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSeed(derivedSeed);
      const privateKey = Buffer.from(keypair.secretKey).toString('hex');
      const publicKey = keypair.publicKey.toString();

      return {
        blockIndex,
        mnemonic,
        walletIndex,
        privateKey,
        publicKey,
        walletAddress: publicKey, // solana public key is wallet address
      };
    } 
    // eth (60)
    else {
      const hdWallet = ethers.HDNodeWallet.fromMnemonic(
        ethers.Mnemonic.fromPhrase(mnemonic),
        path
      );
      const privateKey = hdWallet.privateKey.slice(2); // '0x' prefix
      const publicKey = hdWallet.publicKey.slice(2); // '0x' prefix
      const walletAddress = hdWallet.address;

      return {
        blockIndex,
        mnemonic,
        walletIndex,
        privateKey,
        publicKey,
        walletAddress,
      };
    }
  };

  const generateWallet = () => {
    if (!mnemonic) {
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
      const newWallet = generateWalletFromMnemonics(
        walletType,
        mnemonic,
        wallets.length
      );

      console.log("Generated wallet:", newWallet);
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

  const clearWallet = (index: number) => {
    const filteredWallets = wallets.filter((w) => w.walletIndex !== index);
    setWallets([...filteredWallets]);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
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
              variant={"secondary"}
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
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
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
          <Button onClick={() => generateWallet()}>Create Wallet</Button>
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
            <div>
              {wallets.map((wallet, index) => (
                <Card key={index} className="mb-4 border">
                  <CardHeader>
                    <div className="flex flex-row gap-2 items-center">

                    <CardTitle>
                      <strong>Wallet #{index + 1}</strong>
                    </CardTitle>
                    <CardDescription>
                      <Badge>

                      {wallet.blockIndex === 60 ? "Ethereum" : "Solana"}
                      </Badge>
                    </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Address:</p>
                      <p className="text-sm text-muted-foreground break-all bg-muted p-2 rounded">
                        {wallet.walletAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Public Key:</p>
                      <p className="text-sm text-muted-foreground break-all bg-muted p-2 rounded">
                        {wallet.publicKey.substring(0, 50)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Private Key:</p>
                      <p className="text-sm text-muted-foreground break-all bg-muted p-2 rounded flex justify-between">
                        {wallet.privateKey.substring(0, 50)}
                        <Eye width={"16"} height={"16"} className="mr-2"/>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      onClick={() => copyToClipboard(wallet.walletAddress, index)}
                    >
                      {copied === index ? "Copied!" : "Copy Address"}
                    </Button>
                    <Button
                      variant={"secondary"}
                      onClick={() => clearWallet(wallet.walletIndex)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}