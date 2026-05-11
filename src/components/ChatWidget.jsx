import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Trash2 } from "lucide-react";

const STORAGE_KEY = "timilehin-chat-history-v1";
const STORAGE_POS_KEY = "timilehin-chat-pos-v1";

const DRAG_THRESHOLD = 5; // px of pointer travel before a press becomes a drag
const ICON_GAP = 8; // px between icon and chat panel
const VIEWPORT_MARGIN = 12; // px keep-out from viewport edges

const getIconSize = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches ? 56 : 48;

const clampPos = (p, size) => {
  if (typeof window === "undefined") return p;
  return {
    x: Math.max(VIEWPORT_MARGIN, Math.min(window.innerWidth - size - VIEWPORT_MARGIN, p.x)),
    y: Math.max(VIEWPORT_MARGIN, Math.min(window.innerHeight - size - VIEWPORT_MARGIN, p.y)),
  };
};

const getDefaultPos = () => {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const size = getIconSize();
  // Same offsets as the original bottom-4/right-4 (mobile) and bottom-6/right-6 (desktop).
  const margin = size === 56 ? 24 : 16;
  return {
    x: window.innerWidth - size - margin,
    y: window.innerHeight - size - margin,
  };
};

const loadPos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_POS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p?.x === "number" && typeof p?.y === "number") return p;
  } catch {
    // Corrupt entry — fall back to default.
  }
  return null;
};

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
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Typewriter pacing: while typingState is non-null, the message at messageIndex
  // reveals one chunk at a time even though full text may already be in messages[i].content.
  const [typingState, setTypingState] = useState(null);
  // { messageIndex: number, displayedLen: number, streamDone: boolean }

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Draggable icon position. Restore saved spot (clamped to current viewport) or default to bottom-right.
  const [pos, setPos] = useState(() => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    const saved = loadPos();
    return saved ? clampPos(saved, getIconSize()) : getDefaultPos();
  });

  // Keep the icon on-screen when the viewport shrinks.
  useEffect(() => {
    const onResize = () => setPos((p) => clampPos(p, getIconSize()));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const dragRef = useRef(null);

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return; // primary button / touch only
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      lastPos: pos,
      moved: false,
    };
  };

  const handlePointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    d.moved = true;
    const next = clampPos({ x: d.origX + dx, y: d.origY + dy }, getIconSize());
    d.lastPos = next;
    setPos(next);
  };

  const handlePointerUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may already be released — ignore.
    }
    if (d.moved) {
      try {
        localStorage.setItem(STORAGE_POS_KEY, JSON.stringify(d.lastPos));
      } catch {
        // localStorage may be unavailable — drag still works in-memory.
      }
    } else {
      setOpen((o) => !o);
    }
  };

  const handleIconKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  // Anchor the panel next to the icon, picking the side with more space.
  const getPanelStyle = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const size = getIconSize();
    const isDesktop = vw >= 640;

    const placeAbove = pos.y + size / 2 > vh / 2;
    const placeLeftOfIcon = pos.x + size / 2 > vw / 2;

    const availableHeight = placeAbove
      ? pos.y - ICON_GAP - VIEWPORT_MARGIN
      : vh - (pos.y + size) - ICON_GAP - VIEWPORT_MARGIN;
    const height = Math.max(240, Math.min(560, availableHeight));

    const vertical = placeAbove
      ? { bottom: vh - pos.y + ICON_GAP }
      : { top: pos.y + size + ICON_GAP };

    if (!isDesktop) {
      return {
        left: VIEWPORT_MARGIN,
        right: VIEWPORT_MARGIN,
        ...vertical,
        height,
      };
    }

    const width = Math.min(380, vw - VIEWPORT_MARGIN * 2);
    const horizontal = placeLeftOfIcon
      ? { right: vw - (pos.x + size) }
      : { left: pos.x };

    return { ...horizontal, ...vertical, width, height };
  };

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

  const requestClearChat = () => {
    if (loading || typingState) return;
    setConfirmClearOpen(true);
  };

  const confirmClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setConfirmClearOpen(false);
  };

  const showSuggestions =
    messages.length === 1 &&
    messages[0].content === INITIAL_MESSAGE.content &&
    !loading &&
    !typingState;

  return (
    <>
      {/* Floating Toggle Button — draggable */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleIconKeyDown}
        style={{ position: "fixed", left: pos.x, top: pos.y, touchAction: "none" }}
        className="z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-grab active:cursor-grabbing select-none"
      >
        {open ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Panel — anchored adjacent to the (possibly dragged) icon */}
      {open && (
        <div
          style={{ position: "fixed", ...getPanelStyle() }}
          className="z-50 glass rounded-2xl glow-border flex flex-col overflow-hidden animate-fade-in"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Ask anything</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Online
              </p>
            </div>
            <button
              type="button"
              aria-label="Clear conversation"
              title="Clear conversation"
              onClick={requestClearChat}
              disabled={loading || !!typingState}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3">
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

          {/* Clear-chat confirm modal — scoped inside the panel so it overlays only the chat */}
          {confirmClearOpen && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm animate-fade-in"
              onClick={() => setConfirmClearOpen(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="clear-chat-title"
                onClick={(e) => e.stopPropagation()}
                className="mx-4 w-full max-w-[300px] glass rounded-2xl glow-border p-5 shadow-xl"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 id="clear-chat-title" className="text-sm font-semibold leading-tight">
                      Clear this conversation?
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will permanently delete all messages in this chat. You can't undo it.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmClearOpen(false)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmClearChat}
                    autoFocus
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/90 text-white hover:bg-red-500 transition-all"
                  >
                    Clear chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
