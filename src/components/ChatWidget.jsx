import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Trash2 } from "lucide-react";

const STORAGE_KEY = "timilehin-chat-history-v1";

const SUGGESTIONS = [
  "Explain React hooks in simple terms",
  "Tell me about Timilehin's projects",
  "Tips for landing a junior frontend role",
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I can tell you about Timilehin and his work, or chat about web dev, programming, design, AI, careers in tech — whatever you're curious about. What would you like to explore?",
};

const TYPEWRITER_STEP_MS = 15;
const TYPEWRITER_CHARS_PER_STEP = 2;

const loadStored = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // Corrupt entry — ignore and start fresh.
  }
  return null;
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadStored() ?? [INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Typewriter pacing: while typingState is non-null, the message at messageIndex
  // reveals one chunk at a time even though full text may already be in messages[i].content.
  const [typingState, setTypingState] = useState(null);
  // { messageIndex: number, displayedLen: number, streamDone: boolean }

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Persist messages (skip the lone welcome state).
  useEffect(() => {
    try {
      const isFreshWelcome =
        messages.length === 1 && messages[0].content === INITIAL_MESSAGE.content;
      if (isFreshWelcome) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
      }
    } catch {
      // localStorage may be unavailable (private mode, quota) — chat still works in memory.
    }
  }, [messages]);

  // Scroll to bottom on any visual change.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, typingState]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Typewriter advance loop. Reveals a few characters at a time until caught up,
  // then clears typingState (which removes the caret).
  useEffect(() => {
    if (!typingState) return;
    const target = messages[typingState.messageIndex];
    if (!target) return;

    if (typingState.displayedLen < target.content.length) {
      const id = setTimeout(() => {
        setTypingState((t) => {
          if (!t) return null;
          const cur = messages[t.messageIndex];
          if (!cur) return null;
          return {
            ...t,
            displayedLen: Math.min(
              cur.content.length,
              t.displayedLen + TYPEWRITER_CHARS_PER_STEP,
            ),
          };
        });
      }, TYPEWRITER_STEP_MS);
      return () => clearTimeout(id);
    }

    // Displayed has caught up. If the network stream is also done, finish.
    if (typingState.streamDone) {
      setTypingState(null);
    }
  }, [typingState, messages]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading || typingState) return;

    const next = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let started = false;
      let assistantIndex = -1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        if (!started) {
          started = true;
          setLoading(false);
          assistantIndex = next.length;
          setMessages((m) => [...m, { role: "assistant", content: chunk }]);
          setTypingState({
            messageIndex: assistantIndex,
            displayedLen: 0,
            streamDone: false,
          });
        } else {
          setMessages((m) => {
            const last = m[m.length - 1];
            if (last?.role !== "assistant") return m;
            return [...m.slice(0, -1), { ...last, content: last.content + chunk }];
          });
        }
      }

      // Mark stream complete; typewriter useEffect will finish revealing then clear state.
      if (started) {
        setTypingState((t) => (t ? { ...t, streamDone: true } : null));
      } else {
        setError("No reply from the model. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      setTypingState(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const clearChat = () => {
    if (loading || typingState) return;
    if (window.confirm("Clear this conversation?")) {
      setMessages([INITIAL_MESSAGE]);
      setError(null);
    }
  };

  const showSuggestions =
    messages.length === 1 &&
    messages[0].content === INITIAL_MESSAGE.content &&
    !loading &&
    !typingState;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-8rem))] glass rounded-2xl glow-border flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Ask anything</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Tutor & guide to Timilehin
              </p>
            </div>
            <button
              type="button"
              aria-label="Clear conversation"
              title="Clear conversation"
              onClick={clearChat}
              disabled={loading || !!typingState}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => {
              const isTyping = typingState?.messageIndex === i;
              const text = isTyping
                ? m.content.slice(0, typingState.displayedLen)
                : m.content;
              return (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-surface text-foreground rounded-bl-sm border border-border/50"
                    }`}
                  >
                    {text}
                    {isTyping && (
                      <span className="inline-block w-[2px] h-4 ml-0.5 align-middle bg-primary animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface text-muted-foreground px-3.5 py-2.5 rounded-2xl rounded-bl-sm border border-border/50 flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {showSuggestions && (
              <div className="pt-2 space-y-2">
                <p className="text-xs text-muted-foreground">Try asking:</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-xs bg-surface border border-border/50 hover:border-primary/50 hover:text-primary transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-3 py-3 border-t border-border/50 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              maxLength={500}
              disabled={loading || !!typingState}
              className="flex-1 bg-surface border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50 disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={loading || !!typingState || !input.trim()}
              className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
