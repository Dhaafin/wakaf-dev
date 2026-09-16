"use client";

import { useContext } from "react";
import {
  FlashMessageContext,
  type FlashMessage,
  type FlashMessageKind,
} from "@/context/FlashMessageContext";

export function useFlashMessage() {
  const ctx = useContext(FlashMessageContext);

  if (!ctx) {
    throw new Error(
      "useFlashMessage must be used within a <FlashMessageProvider>.",
    );
  }

  const { messages, push, dismiss, clear } = ctx;

  const success = (title: string, desc?: string, duration?: number) =>
    push({ kind: "success", title, desc, duration });

  const error = (title: string, desc?: string, duration?: number) =>
    push({ kind: "error", title, desc, duration });

  const warning = (title: string, desc?: string, duration?: number) =>
    push({ kind: "warning", title, desc, duration });

  const info = (title: string, desc?: string, duration?: number) =>
    push({ kind: "info", title, desc, duration });

  return {
    messages,
    toasts: messages, // Alias untuk kompatibilitas penuh dengan pemanggilan toast lama
    push,
    success,
    error,
    warning,
    info,
    dismiss,
    clear,
  };
}

// Alias konsisten dengan terminologi umum
export const useToast = useFlashMessage;
export type { FlashMessage, FlashMessageKind };
