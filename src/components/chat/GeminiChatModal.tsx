import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Cpu,
  RefreshCw,
  Terminal,
  Minimize2,
  Maximize2,
  AlertCircle
} from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export const GeminiChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      text: "Hello! I am Abhas's Gemini-powered technical assistant. You can ask me about his system architecture, RAG pipelines, GitHub repositories, technical skills, or discuss engineering tradeoffs.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modelUsed: "gemini-3.5-flash",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [complexity, setComplexity] = useState<"general" | "fast" | "complex">("general");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText("");
    setErrorMsg(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Send conversation history to backend Gemini proxy
      const payload = {
        messages: newHistory.map((m) => ({
          role: m.role,
          text: m.text,
        })),
        taskComplexity: complexity,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to receive response from Gemini.");
      }

      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while calling the Gemini API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: "assistant",
        text: "Conversation reset. What technical topics or questions about Abhas's work would you like to explore?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: "gemini-3.5-flash",
      },
    ]);
    setErrorMsg(null);
  };

  const samplePrompts = [
    "Explain your RAG search engine architecture",
    "What is your experience with LangGraph & agents?",
    "Tell me about your C++ and systems projects",
  ];

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right, Solid Green Theme, No Gradients) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Gemini Technical Assistant Chat"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#166534] dark:bg-[#22C55E] text-white dark:text-black border border-[#166534] dark:border-[#22C55E] shadow-xl hover:bg-[#14532D] dark:hover:bg-[#16a34a] transition-all cursor-pointer font-mono text-xs uppercase tracking-wider group"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="font-semibold">Ask Gemini</span>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[460px] h-[580px] max-h-[88vh] flex flex-col bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] shadow-2xl overflow-hidden font-sans"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#050805]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 border border-[#166534] dark:border-[#22C55E] bg-[#166534] dark:bg-[#22C55E] text-white dark:text-black flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3
                  id="chat-title"
                  className="text-xs font-bold font-mono tracking-tight text-[#111827] dark:text-white"
                >
                  Gemini Technical Assistant
                </h3>
                <div className="text-[10px] font-mono text-[#166534] dark:text-[#22C55E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#166534] dark:bg-[#22C55E]" />
                  <span>Online · Multi-turn Context</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#111827] dark:hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#111827] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Mode Selection Strip */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#0D1711] text-[11px] font-mono">
            <span className="text-[#4B5563] dark:text-[#A7B0AA]">Model Engine:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setComplexity("fast")}
                className={`px-2 py-0.5 border text-[10px] cursor-pointer ${
                  complexity === "fast"
                    ? "bg-[#166534] text-white border-[#166534] dark:bg-[#22C55E] dark:text-black dark:border-[#22C55E] font-semibold"
                    : "border-[#DDE8E1] dark:border-[#1B3022] text-[#4B5563] dark:text-[#A7B0AA]"
                }`}
                title="gemini-3.1-flash-lite (Fastest latency)"
              >
                Flash-Lite
              </button>
              <button
                onClick={() => setComplexity("general")}
                className={`px-2 py-0.5 border text-[10px] cursor-pointer ${
                  complexity === "general"
                    ? "bg-[#166534] text-white border-[#166534] dark:bg-[#22C55E] dark:text-black dark:border-[#22C55E] font-semibold"
                    : "border-[#DDE8E1] dark:border-[#1B3022] text-[#4B5563] dark:text-[#A7B0AA]"
                }`}
                title="gemini-3.5-flash (Balanced reasoning)"
              >
                3.5-Flash
              </button>
              <button
                onClick={() => setComplexity("complex")}
                className={`px-2 py-0.5 border text-[10px] cursor-pointer ${
                  complexity === "complex"
                    ? "bg-[#166534] text-white border-[#166534] dark:bg-[#22C55E] dark:text-black dark:border-[#22C55E] font-semibold"
                    : "border-[#DDE8E1] dark:border-[#1B3022] text-[#4B5563] dark:text-[#A7B0AA]"
                }`}
                title="gemini-3.1-pro-preview (Advanced technical reasoning)"
              >
                3.1-Pro
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7FAF8] dark:bg-[#050805]">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                    {isUser ? (
                      <>
                        <span>You</span>
                        <span>·</span>
                        <span>{m.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#166534] dark:text-[#22C55E] font-semibold">
                          Gemini
                        </span>
                        {m.modelUsed && (
                          <span className="text-[9px] px-1 border border-[#DDE8E1] dark:border-[#1B3022]">
                            {m.modelUsed}
                          </span>
                        )}
                        <span>·</span>
                        <span>{m.timestamp}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`p-3 max-w-[88%] text-xs leading-relaxed ${
                      isUser
                        ? "bg-[#166534] text-white dark:bg-[#22C55E] dark:text-black font-medium"
                        : "bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-[#E5E7EB]"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{m.text}</div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="p-3 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] text-xs font-mono text-[#166534] dark:text-[#22C55E] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#166534] dark:bg-[#22C55E] animate-ping" />
                  <span>Synthesizing response via Gemini...</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Execution Error:</div>
                  <div>{errorMsg}</div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions (if few messages) */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-white dark:bg-[#0D1711] border-t border-[#DDE8E1] dark:border-[#1B3022] flex flex-wrap gap-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(p);
                  }}
                  className="text-[10px] font-mono text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#166534] dark:hover:text-[#22C55E] px-2 py-1 border border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#050805] text-left cursor-pointer transition-colors truncate max-w-full"
                >
                  "{p}"
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#0D1711] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about systems, projects, or algorithms..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs font-mono bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white focus:border-[#166534] dark:focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              aria-label="Send query"
              className="p-2 border border-[#166534] dark:border-[#22C55E] bg-[#166534] text-white dark:bg-[#22C55E] dark:text-black hover:bg-[#14532D] dark:hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
