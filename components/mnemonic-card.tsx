"use client"

import { useState } from "react"
import { Copy, RefreshCw, Key } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Input } from "./ui/input"

interface MnemonicCardProps {
  mnemonic: string
  onRegenerateMnemonic: () => void
}

export default function MnemonicCard({ mnemonic, onRegenerateMnemonic }: MnemonicCardProps) {
  const [copied, setCopied] = useState<boolean>(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic)
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
  }

  return (
    <Card className="w-full max-w-full border-border/40 bg-card/95 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mnemonic Phrase</span>
          {mnemonic && (
            <Button variant="ghost" size="icon" onClick={onRegenerateMnemonic} aria-label="Generate new mnemonic">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[180px]">
        {mnemonic ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {mnemonic.split(" ").map((word, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-1 text-xs text-muted-foreground">{index + 1}.</span>
                  <Input
                    type="text"
                    className="w-full rounded-md border border-input bg-background p-2 text-sm"
                    value={word}
                    disabled
                    aria-label={`Word ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">This is your secret wallet recovery phrase. Keep it safe.</p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <Key className="h-16 w-16 text-muted-foreground" />
            <p className="text-center text-sm text-muted-foreground">
              Generate a mnemonic phrase to secure your wallet
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onRegenerateMnemonic} variant="default">
          {mnemonic ? "Regenerate Secret" : "Generate Secret"}
        </Button>
        {mnemonic && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={copyToClipboard} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy Mnemonic</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  )
}

