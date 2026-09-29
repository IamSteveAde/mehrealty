
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
import ConciergeLeadForm, {type ConciergeDetails} from "./ConciergeLeadForm";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, RotateCcw, Send, X } from "lucide-react";

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
  {
    title: "Acquire a residence",
    description: "Explore a considered collection of exceptional homes.",
    message: "I'd like to explore your residences and find a home to acquire.",
  },
  {
    title: "Explore investments",
    description: "Discover opportunities shaped around long-term value.",
    message: "I'd like to explore MEH Realty's property investment opportunities.",
  },
  {
    title: "Property management",
    description: "A thoughtful approach to the care of your property.",
    message: "I'd like to learn about your property management services.",
  },
  {
    title: "Hospitality & partnerships",
    description: "Explore our expertise and strategic collaborations.",
    message: "I'd like to explore your hospitality services and partnership opportunities.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

function renderInlineMarkdown(text: string) {
  const tokens = text.split(
    /(\*\*[^*]+\*\*|\[[^\]]+\]\(\/(?!\/)[^)\s]+\))/g
  );

  return tokens.map((token, index) => {
    const bold = token.match(/^\*\*([\s\S]+)\*\*$/);

    if (bold) {
      return (
        <strong key={index} className="font-semibold">
          {bold[1]}
        </strong>
      );
    }

    const link = token.match(
      /^\[([^\]]+)\]\((\/(?:contact|about|services|developments)(?:\/[a-zA-Z0-9_-]+)?)\)$/
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
        small ? "h-7 w-7" : "h-9 w-9"
      }`}
    >
      <span
        className={`font-[family-name:var(--font-fraunces)] italic leading-none text-[#a3814b] ${
          small ? "text-[15px]" : "text-[20px]"
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
  const [error, setError] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState<ConciergeDetails | null>(null);
  const failedDetailsRef = useRef<ConciergeDetails | undefined>(undefined);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [viewportTop, setViewportTop] = useState(0);
  const stateRef = useRef<string | undefined>(undefined);
  const busyRef = useRef(false);
  const failedRef = useRef<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Msg[]>([
    INITIAL_MESSAGE,
  ]);

  const [viewportHeight, setViewportHeight] = useState<
    number | null
  >(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const hasConversation = messages.length > 1;

  // Keep the mobile chat within the visible viewport,
  // including when the on-screen keyboard is open.
  useEffect(() => {
    if (!open) {
      setViewportHeight(null);
      return;
    }

    const updateViewport = () => {
      const viewport = window.visualViewport;

      if (viewport) {
        setViewportHeight(viewport.height);
        setViewportTop(viewport.offsetTop);
      } else {
        setViewportHeight(window.innerHeight);
      }
    };

    updateViewport();
    window.visualViewport?.addEventListener("scroll", updateViewport);

    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener(
      "resize",
      updateViewport
    );

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      window.visualViewport?.removeEventListener(
        "resize",
        updateViewport
      );
    };
  }, [open]);

  // Scroll only the message area.
  useEffect(() => {
    if (!open) return;

    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      top: messages.length > 1 ? container.scrollHeight : 0,
      behavior: "smooth",
    });
  }, [messages, busy, open]);

  // Focus the close button first so opening the
  // chat does not immediately open the mobile keyboard.
  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      closeRef.current?.focus({ preventScroll: true });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Tab") {
        const elements = panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], textarea:not(:disabled), input:not(:disabled)');
        const first = elements?.[0]; const last = elements?.[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () =>
      window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

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
    async (text?: string, details?: ConciergeDetails) => {
      const content = (text ?? input).trim();

      if (!content || busyRef.current) return;
      busyRef.current = true;
      setError(null);

      const next: Msg[] = failedRef.current === content
        ? messages
        : [...messages, { role: "user", content }];

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
          body: JSON.stringify({ message: content, state: stateRef.current, details }),
          signal: controller.signal,
        });

        const data: { reply?: string; state?: string; error?: string; confirmationRequired?: boolean; leadForm?: ConciergeDetails | null } = await response.json();
        if (!response.ok) throw new Error(data.error || "Request failed. Please try again.");
        if (!data.reply || !data.state) throw new Error("Incomplete response. Please retry.");
        stateRef.current = data.state;
        failedRef.current = null;
        failedDetailsRef.current = undefined;
        setLeadForm(data.leadForm || null);
        setPendingConfirmation(Boolean(data.confirmationRequired));

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

        failedRef.current = content;
        failedDetailsRef.current = details;
        setError(error instanceof Error ? error.message : "Unable to connect. Please retry.");
      } finally {
        if (requestRef.current === controller) {
          requestRef.current = null;
          setBusy(false);
          busyRef.current = false;
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
            className="fixed inset-0 z-[9998] cursor-default bg-[#11120f]/50 backdrop-blur-[3px] sm:bg-[#11120f]/20 sm:backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* FLOATING CONCIERGE */}
      <div
        style={open && viewportHeight ? { top: viewportTop + 12, height: viewportHeight - 24, bottom: "auto" } : undefined}
        className="
          pointer-events-none
          fixed inset-0 z-[9999]
          flex flex-col items-end justify-end
          sm:inset-auto sm:bottom-6 sm:right-6
          lg:bottom-8 lg:right-8
        "
      >
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id="meh-concierge-panel"
              role="dialog"
              aria-modal="true"
              aria-label="MEH Realty concierge"
              initial={{
                opacity: 0,
                y: 16,
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
                duration: 0.28,
                ease: EASE,
              }}
              style={{
                maxHeight: viewportHeight
                  ? `min(580px, ${Math.max(
                      0,
                      viewportHeight - 40
                    )}px)`
                  : undefined,
              }}
              className="
                pointer-events-auto
                relative flex min-h-0 w-[calc(100%-24px)]
                max-w-[390px] flex-col
                overflow-hidden
                rounded-[18px]
                border border-[#ddd6c9]
                bg-[#faf9f6]
                shadow-[0_24px_80px_rgba(0,0,0,0.24)]

                mb-[max(12px,env(safe-area-inset-bottom))]
                mr-3
                h-[min(580px,calc(100dvh-32px))]

                sm:mb-3 sm:mr-0
                sm:h-[min(600px,calc(100dvh-110px))]
                sm:w-[390px]
                sm:rounded-[20px]
              "
            >
              {/* GOLD ACCENT */}
              <div className="h-[2px] shrink-0 bg-[#b8975a]" />

              {/* HEADER: NEVER SCROLLS */}
              <header className="relative z-10 shrink-0 bg-[#1b1c19] px-4 py-3 text-white sm:px-5 sm:py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <BrandAvatar />

                    <div className="min-w-0">
                      <h2 className="truncate font-[family-name:var(--font-fraunces)] text-[18px] font-light leading-tight tracking-[-0.03em] sm:text-[21px]">
                        MEH Concierge
                      </h2>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#b8975a]" />
                        <span className="truncate text-[9px] uppercase tracking-[0.12em] text-white/55">
                          Digital assistance
                        </span>
                      </div>
                    </div>
                  </div>

                {hasConversation && <button type="button" disabled={busy} onClick={() => {
                  stateRef.current = undefined; failedRef.current = null; failedDetailsRef.current = undefined; setLeadForm(null);
                  setMessages([INITIAL_MESSAGE]); setError(null); setInput(""); setPendingConfirmation(false);
                }} aria-label="Start a new chat" title="Start a new chat" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 disabled:opacity-40"><RotateCcw size={16}/></button>}
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Close concierge"
                    title="Close chat"
                    className="
                      relative z-20
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-full
                      border border-white/20
                      bg-white/10
                      text-white
                      transition-colors
                      hover:border-[#b8975a]
                      hover:bg-white/20
                      focus-visible:outline
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-[#b8975a]
                    "
                  >
                    <X size={20} strokeWidth={1.8} />
                  </button>
                </div>
              </header>

              {/* SCROLLABLE CHAT AREA */}
              <div
                ref={scrollRef}
                aria-live="polite"
                className="
                  min-h-0 flex-1
                  space-y-4 overflow-y-auto
                  overscroll-contain
                  px-3 py-4
                  sm:space-y-5 sm:px-5 sm:py-5
                "
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d1c6b4 transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#e5dfd4]" />

                  <span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-[#a39a8b]">
                    AI-assisted conversation
                  </span>

                  <span className="h-px flex-1 bg-[#e5dfd4]" />
                </div>

                <p className="mt-2 text-center text-[10px] text-[#756b5d]">Messages are processed by AI. Contact details are sent to our team only after you confirm.</p>

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
                        className={`min-w-0 max-w-[86%] rounded-[13px] px-3 py-2.5 text-[12px] leading-[1.7] sm:px-3.5 sm:py-3 sm:text-[12.5px] ${
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

                {/* TYPING INDICATOR */}
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
              {error && <div role="alert" className="shrink-0 border-t bg-[#fff5e8] px-4 py-2 text-xs text-[#624827]">
                {error}
                <button type="button" disabled={busy} onClick={() => void send(failedRef.current || undefined, failedDetailsRef.current)} className="ml-2 min-h-11 underline">Retry</button>
              </div>}
              {leadForm && <ConciergeLeadForm key={JSON.stringify(leadForm)} initial={leadForm} busy={busy}
                onReview={details => void send("Please review my enquiry details.", details)}
                onCancel={() => { setLeadForm(null); void send("I would like to continue chatting without submitting an enquiry."); }}/>}
              {pendingConfirmation && !error && <div className="shrink-0 px-4 py-2">
                <button type="button" disabled={busy} onClick={() => void send("Yes, please")} className="min-h-11 rounded-lg bg-[#b8975a] px-4 text-xs disabled:opacity-50">Confirm enquiry & allow contact</button>
                <button type="button" disabled={busy} onClick={() => void send("I want to edit my details in the form before submitting.")} className="min-h-11 ml-2 text-xs underline">Edit details</button>
              </div>}

              {/* QUICK SUGGESTIONS */}
              {!hasConversation && (
                <div className="shrink-0 border-t border-[#eee9e1] px-3 py-2.5 sm:px-5">
                  <p className="mb-2 text-[9px] uppercase tracking-[0.12em] text-[#8c806d]">
                    You might be interested in
                  </p>

                  <div className="grid gap-2">
                    {SUGGESTIONS.map((suggestion, index) => (
                      <button
                        key={suggestion.title}
                        type="button"
                        disabled={busy}
                        onClick={() => void send(suggestion.message)}
                        className="flex min-h-11 w-full items-start gap-3 rounded-xl border border-[#ded3c0] bg-white p-3 text-left text-[#62533c] transition-colors hover:border-[#b8975a] hover:bg-[#f4eddf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b8975a] disabled:opacity-50"
                      >
                        <span className="pt-0.5 font-mono text-[10px] text-[#a2824f]">{String(index + 1).padStart(2, "0")}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-semibold">{suggestion.title}</span>
                          <span className="mt-1 block text-[11px] leading-5 text-[#756b5d]">{suggestion.description}</span>
                        </span>
                        <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-[#b8975a]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              </div>

              {/* MESSAGE COMPOSER */}
              <div className="shrink-0 border-t border-[#e9e4db] bg-white px-3 pb-3 pt-2.5 sm:px-5 sm:pb-4">
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
                    className="max-h-24 min-h-[38px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-[16px] leading-5 text-[#22231f] outline-none placeholder:text-[#a59b8d] sm:text-[12.5px]"
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
                  onClick={close}
                  className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-[#92703f] transition-colors hover:text-[#171714]"
                >
                  Speak with our team
                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.4}
                  />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING BUTTONS */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="
                pointer-events-auto
                mb-[max(20px,env(safe-area-inset-bottom))]
                mr-4 flex flex-col items-end gap-2.5
                sm:mb-0 sm:mr-0
              "
            >
              {/* WHATSAPP */}
              {/^[1-9]\d{6,14}$/.test(WHATSAPP_NUMBER) && <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hello MEH Realty, I'd like to make an enquiry."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with MEH Realty on WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b8975a]/50 bg-[#1b1c19] text-[#d8bd86] shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-colors hover:border-[#d8bd86] hover:bg-[#b8975a] hover:text-[#1b1c19]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.47 0 .1 5.35.1 11.94c0 2.1.55 4.16 1.6 5.98L0 24l6.25-1.64a11.96 11.96 0 0 0 5.8 1.48h.01c6.58 0 11.94-5.35 11.94-11.94a11.87 11.87 0 0 0-3.48-8.42ZM12.06 21.8a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.73.98.99-3.63-.23-.37a9.85 9.85 0 0 1-1.52-5.25c0-5.45 4.44-9.89 9.9-9.89a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.88-9.92 9.88Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.49 1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.1 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>
              </a>}

              {/* CONCIERGE TRIGGER */}
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open MEH concierge"
                aria-expanded={false}
                aria-controls="meh-concierge-panel"
                className="group flex h-12 items-center gap-2.5 rounded-full border border-[#b8975a]/60 bg-[#1b1c19] pl-2 pr-4 text-white shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d8bd86] hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a]"
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
