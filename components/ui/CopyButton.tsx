"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

export function CopyButton({ textToCopy, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("w-24 font-mono", className)}
      onClick={handleCopy}
    >
      {copied ? "Copied!" : label}
    </Button>
  );
}
