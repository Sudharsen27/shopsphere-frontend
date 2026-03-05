"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

let id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((toastId: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const toastId = ++id;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => removeToast(toastId), 3500);
  }, [removeToast]);

  const toast = useCallback((message: string, type?: ToastType) => {
    addToast(message, type ?? "info");
  }, [addToast]);

  const success = useCallback((message: string) => addToast(message, "success"), [addToast]);
  const error = useCallback((message: string) => addToast(message, "error"), [addToast]);
  const info = useCallback((message: string) => addToast(message, "info"), [addToast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto px-4 py-3 rounded-lg shadow-lg border text-sm font-medium
              animate-[fadeIn_0.2s_ease-out]
              ${t.type === "success" ? "bg-green-900/95 text-green-100 border-green-600/50" : ""}
              ${t.type === "error" ? "bg-red-900/95 text-red-100 border-red-600/50" : ""}
              ${t.type === "info" ? "bg-gray-800/95 text-gray-100 border-gray-600/50" : ""}
            `}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {}, success: () => {}, error: () => {}, info: () => {} };
  return ctx;
}
