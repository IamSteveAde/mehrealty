
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Msg = {
  role: "assistant",
  content:
    "Welcome to MEH Realty. Looking for a residence, exploring an investment, or simply have a question? I'm here to help.",
};

const SUGGESTIONS = [
  "Explore residences",
  "Investment opportunities",
  "Arrange a viewing",
];

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Safely render a small, controlled subset of Markdown:
 * - **bold**
 * - [link text](https://...)
 * - line breaks
 *
 * This prevents raw Markdown syntax appearing in messages
 * without requiring an additional package.
 */
function renderInlineMarkdown(text: string) {
  const tokens = text.split(
    /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g
  );

  return tokens.map((token, index) => {
  const bold = token.match(/^\*\*([\s\S]+)\*\*$/);

    if (bold) {
      return (
        <strong
          key={index}
          className="font-semibold text-inherit"
        >
          {bold[1]}
        </strong>
      );
    }

    const link = token.match(
      /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/
    );

    if (link) {
      return (
        <a
          key={index}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline decoration-[#b8975a]/70 underline-offset-[3px] transition-colors hover:text-[#b8975a]"
        >
          {link[1]}
          <ArrowUpRight
            size={11}
            className="ml-0.5 inline-block align-baseline"
          />
        </a>
      );
    }

    return <span key={index}>{token}</span>;
  });
}

function MessageContent({ content }: { content: string }) {
  return (
    <div className="space-y-2.5">
      {content
        .trim()
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((paragraph, index) => (
          <p
            key={index}
            className="whitespace-pre-wrap break-words"
          >
            {renderInlineMarkdown(paragraph)}
          </p>
        ))}
    </div>
  );
}

function BrandAvatar({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d8c7a7] bg-[#f1eadc] ${
        small ? "h-7 w-7" : "h-10 w-10"
      }`}
    >
      <span
        className={`font-[family-name:var(--font-fraunces)] italic leading-none text-[#a3814b] ${
          small ? "text-[15px]" : "text-[22px]"
        }`}
      >
        M
      </span>
    </span>
  );
}

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    INITIAL_MESSAGE,
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  const hasConversation = messages.length > 1;

  useEffect(() => {
    if (!open) return;

    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const mobile = window.matchMedia("(max-width: 639px)");

    if (!mobile.matches) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  const send = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();

      if (!content || busy) return;

      const next: Msg[] = [
        ...messages,
        { role: "user", content },
      ];

      setMessages(next);
      setInput("");
      setBusy(true);

      const controller = new AbortController();
      requestRef.current = controller;

      try {
        const response = await fetch("/api/concierge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: next }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data: { reply?: string } =
          await response.json();

        setMessages([
          ...next,
          {
            role: "assistant",
            content:
              typeof data.reply === "string" &&
              data.reply.trim()
                ? data.reply
                : "I can help you connect with our team for further details.",
          },
        ]);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setMessages([
          ...next,
          {
            role: "assistant",
            content:
              "I'm unable to connect at the moment. You can reach our team through the contact page.",
          },
        ]);
      } finally {
        if (requestRef.current === controller) {
          requestRef.current = null;
          setBusy(false);
        }
      }
    },
    [input, busy, messages]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void send();
    }
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      {/* BACKDROP */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close concierge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] cursor-default bg-[#11120f]/35 backdrop-blur-[2px] sm:bg-[#11120f]/10 sm:backdrop-blur-[1px]"
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex flex-col items-end sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
        {/* CHAT PANEL */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="meh-concierge-panel"
              role="dialog"
              aria-modal="true"
              aria-label="MEH Realty concierge"
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 12,
                scale: 0.98,
              }}
              transition={{
                duration: 0.35,
                ease: EASE,
              }}
              className="pointer-events-auto relative flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#faf9f6] shadow-[0_25px_85px_rgba(0,0,0,0.18)] sm:mb-3 sm:h-[min(610px,calc(100dvh-110px))] sm:w-[390px] sm:rounded-[18px] sm:border sm:border-[#ddd6c9]"
            >
              {/* GOLD TOP LINE */}
              <div className="h-[2px] shrink-0 bg-[#b8975a]" />

              {/* HEADER */}
              <header className="shrink-0 bg-[#1b1c19] px-5 py-4 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <BrandAvatar />

                    <div className="min-w-0">
                      <h2 className="font-[family-name:var(--font-fraunces)] text-[21px] font-light leading-tight tracking-[-0.03em]">
                        MEH Concierge
                      </h2>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#b8975a]" />

                        <span className="text-[9px] uppercase tracking-[0.14em] text-white/50">
                          Digital assistance
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close concierge"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-[#b8975a] hover:text-white"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </header>

              {/* CHAT BODY */}
              <div
                ref={scrollRef}
                aria-live="polite"
                className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d1c6b4 transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#e5dfd4]" />

                  <span className="text-[9px] uppercase tracking-[0.15em] text-[#a39a8b]">
                    Private conversation
                  </span>

                  <span className="h-px flex-1 bg-[#e5dfd4]" />
                </div>

                {messages.map((message, index) => {
                  const assistant =
                    message.role === "assistant";

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-end gap-2 ${
                        assistant
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      {assistant && <BrandAvatar small />}

                      <div
                        className={`max-w-[87%] rounded-[13px] px-3.5 py-3 text-[12.5px] leading-[1.8] ${
                          assistant
                            ? "rounded-bl-[3px] border border-[#e9e4db] bg-white text-[#33332d]"
                            : "rounded-br-[3px] bg-[#22231f] text-white"
                        }`}
                      >
                        <MessageContent
                          content={message.content}
                        />
                      </div>
                    </motion.div>
                  );
                })}

                {/* TYPING */}
                {busy && (
                  <div className="flex items-end gap-2">
                    <BrandAvatar small />

                    <div className="flex items-center gap-1 rounded-[12px] rounded-bl-[3px] border border-[#e9e4db] bg-white px-4 py-3">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 1,
                            delay: dot * 0.15,
                            repeat: Infinity,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-[#b8975a]"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* QUICK QUESTIONS */}
              {!hasConversation && (
                <div className="shrink-0 px-4 pb-3 sm:px-5">
                  <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-[#8c806d]">
                    You might be interested in
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        disabled={busy}
                        onClick={() => void send(suggestion)}
                        className="rounded-full border border-[#ded3c0] bg-white px-3 py-2 text-[10px] text-[#62533c] transition-colors hover:border-[#b8975a] hover:bg-[#f4eddf] disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPOSER */}
              <div className="shrink-0 border-t border-[#e9e4db] bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-4">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-end gap-2 rounded-[12px] border border-[#ded6c9] bg-[#faf9f6] p-1.5 transition-colors focus-within:border-[#b8975a]"
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(event) =>
                      setInput(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    rows={1}
                    maxLength={2000}
                    aria-label="Your message"
                    placeholder="Ask me anything..."
                    className="max-h-24 min-h-[39px] min-w-0 flex-1 resize-none bg-transparent px-2.5 py-2.5 text-[12.5px] leading-5 text-[#22231f] outline-none placeholder:text-[#a59b8d]"
                  />

                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    aria-label="Send message"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-[#b8975a] text-[#171714] transition-colors hover:bg-[#d2b478] disabled:bg-[#e8e3db] disabled:text-[#a7a096]"
                  >
                    <Send size={15} strokeWidth={1.6} />
                  </button>
                </form>

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#92703f] transition-colors hover:text-[#171714]"
                >
                  Speak with our team
                  <ArrowUpRight size={12} strokeWidth={1.4} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


{/* WHATSAPP FLOATING BUTTON */}
<AnimatePresence>
  {!open && (
    <motion.a
      href={`https://wa.me/234XXXXXXXXXX?text=${encodeURIComponent(
        "Hello MEH Realty, I'd like to make an enquiry."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MEH Realty on WhatsApp"
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="pointer-events-auto mb-3 mr-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#b8975a]/50 bg-[#1b1c19] text-[#d8bd86] shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-colors hover:border-[#d8bd86] hover:bg-[#b8975a] hover:text-[#1b1c19] sm:mr-0"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-[21px] w-[21px]"
      >
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.47 0 .1 5.35.1 11.94c0 2.1.55 4.16 1.6 5.98L0 24l6.25-1.64a11.96 11.96 0 0 0 5.8 1.48h.01c6.58 0 11.94-5.35 11.94-11.94a11.87 11.87 0 0 0-3.48-8.42ZM12.06 21.8a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.73.98.99-3.63-.23-.37a9.85 9.85 0 0 1-1.52-5.25c0-5.45 4.44-9.89 9.9-9.89a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.88-9.92 9.88Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.49 1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.1 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </motion.a>
  )}
</AnimatePresence>


        {/* MINIMAL FLOATING BUTTON */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-auto mb-[max(20px,env(safe-area-inset-bottom))] mr-5 sm:mb-0 sm:mr-0"
            >
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open MEH concierge"
                aria-expanded={open}
                aria-controls="meh-concierge-panel"
                className="group flex h-12 items-center gap-2.5 rounded-full border border-[#b8975a]/60 bg-[#1b1c19] pl-2 pr-4 text-white shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d8bd86] hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b8975a]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b8975a] text-[#1b1c19]">
                  <MessageCircle
                    size={16}
                    strokeWidth={1.5}
                  />
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.12em]">
                  Concierge
                </span>

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.4}
                  className="text-[#b8975a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
