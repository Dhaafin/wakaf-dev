"use client";

import {
  createContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { FlashMessageViewport } from "@/components/layout/FlashMessageViewport";

export type FlashMessageKind = "success" | "error" | "info" | "warning";

export interface FlashMessage {
  id: string;
  kind: FlashMessageKind;
  title: string;
  desc?: string;
  duration?: number;
}

export interface FlashMessageContextType {
  messages: FlashMessage[];
  push: (msg: Omit<FlashMessage, "id">) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const FlashMessageContext = createContext<FlashMessageContextType | null>(
  null,
);

const MAX_VISIBLE_MESSAGES = 4;
const DEFAULT_DURATION = 4200;

export function FlashMessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<FlashMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  const push = useCallback(
    (msg: Omit<FlashMessage, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      const newMsg: FlashMessage = { ...msg, id };

      setMessages((prev) => {
        // Batasi pesan aktif agar tidak memenuhi layar (maksimal 4)
        const trimmed = prev.length >= MAX_VISIBLE_MESSAGES ? prev.slice(1) : prev;
        return [...trimmed, newMsg];
      });

      const duration = msg.duration ?? DEFAULT_DURATION;
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      messages,
      push,
      dismiss,
      clear,
    }),
    [messages, push, dismiss, clear],
  );

  return (
    <FlashMessageContext.Provider value={value}>
      {children}
      <FlashMessageViewport />
    </FlashMessageContext.Provider>
  );
}
