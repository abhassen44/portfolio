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
import { FormattedMarkdown } from "./FormattedMarkdown";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  modelUsed?: string;
}

// Resilient client-side knowledge generator if backend is unavailable or deployed statically
function getClientPortfolioReply(userQuery: string): string {
  const query = userQuery.toLowerCase();

  if (query.includes("langgraph") || query.includes("agent")) {
    return "### Experience with LangGraph & Multi-Agent Systems\n\nAbhas has designed and implemented multi-agent architectures using **LangGraph** and **LangChain**:\n- **Multi-Agent Code Evaluation**: Built autonomous loops incorporating AST validation, lint verification, and tree-sitter context parsing for automated code review.\n- **Orchestration**: Coordinated stateful graphs with conditional branching, error-recovery nodes, and memory persistence.\n- **Production Impact**: Reduced review turnaround time by 64% and improved automated test coverage generation.";
  }

  if (query.includes("rag") || query.includes("retrieval") || query.includes("vector") || query.includes("qdrant")) {
    return "### RAG & Semantic Retrieval Architecture\n\nAbhas's RAG system architecture:\n- **Hybrid Dense & Sparse Search**: Combines **Qdrant** vector indexing with BM25 sparse keyword ranking.\n- **Cross-Encoder Reranking**: Applies cross-encoder reranking to achieve sub-50ms query latency with high top-k precision over 2.4M technical documents.\n- **Document Ingestion**: Multi-document ingestion pipeline querying 1000+ pages of PDFs, cutting retrieval turnaround time by 70%.";
  }

  if (query.includes("coding platform") || query.includes("docker") || query.includes("monaco") || query.includes("intelligent")) {
    return "### Intelligent AI Coding Platform\n\n- **Isolated Dev Workspaces**: Containerized execution environments using **Docker** for sandboxed code evaluation across Python, C++, and JavaScript.\n- **Monaco Editor Integration**: Interactive browser-based code editing with syntax highlighting and live diagnostics.\n- **Background Pipeline**: Asynchronous background workers using **Celery** and vector context retrieval via **Qdrant**.";
  }

  if (query.includes("drawsync") || query.includes("canvas") || query.includes("whiteboard")) {
    return "### DrawSync — Collaborative Whiteboard\n\n- **Real-Time Synchronization**: Built with **WebSockets** and **PostgreSQL** for multi-user low-latency vector canvas drawing.\n- **AI Assistance**: Integrated Gemini AI for real-time diagram analysis and shape completion suggestions.";
  }

  if (query.includes("xai") || query.includes("explainable") || query.includes("shap") || query.includes("lime")) {
    return "### Explainable AI (XAI) Project\n\n- Developed machine learning and deep learning pipelines (CNN-LSTM, SVM, DNN) with **SHAP** (SHapley Additive exPlanations) and **LIME** algorithms for real-time model interpretability and transparency.";
  }

  if (query.includes("leetcode") || query.includes("algorithm") || query.includes("dsa") || query.includes("problem")) {
    return "### LeetCode & Problem Solving\n\n- **450+ Problems Solved**: Extensive practice across Dynamic Programming, Graph algorithms, Trees, and Sliding Window techniques.\n- **Profile**: [leetcode.com/abhassen44](https://leetcode.com/abhassen44).\n- Strong foundation in algorithmic complexity, memory profiling, and C++ STL.";
  }

  if (query.includes("skill") || query.includes("tech") || query.includes("stack") || query.includes("language")) {
    return "### Technical Competencies\n\n- **Languages**: Python, C++, C, TypeScript, JavaScript, Java.\n- **AI / ML**: LangGraph, LangChain, RAG Pipelines, Qdrant, TensorFlow, Scikit-learn, SHAP/LIME.\n- **Full-Stack**: React, Next.js, FastAPI, Node.js, Express.js, Tailwind CSS, Three.js, GSAP.\n- **Infrastructure**: Docker, Kubernetes, PostgreSQL, MongoDB Atlas, Redis Streams, Neo4j, AWS.";
  }

  if (query.includes("education") || query.includes("college") || query.includes("university") || query.includes("degree") || query.includes("iiit")) {
    return "### Academic Background\n\n- **Institution**: Indian Institute of Information Technology, Guwahati (IIITG)\n- **Degree**: B.Tech in Computer Science & Engineering (2023 – 2027)\n- **CGPA**: 7.63\n- **Fellowship**: Buildspace Season 5 Fellow";
  }

  if (query.includes("contact") || query.includes("email") || query.includes("linkedin") || query.includes("resume") || query.includes("phone")) {
    return "### Contact & Verified Links\n\n- **Email**: [abhassen44@gmail.com](mailto:abhassen44@gmail.com)\n- **LinkedIn**: [linkedin.com/in/abhas-sen-1a0862282](https://www.linkedin.com/in/abhas-sen-1a0862282/)\n- **GitHub**: [github.com/abhassen44](https://github.com/abhassen44)\n- **Resume**: [View on Google Drive](https://drive.google.com/file/d/1989kYQ8f7JAeh13pbDGS9icrlevHuHmB/view?usp=sharing)\n- **Phone**: +91 9826505141";
  }

  return "Abhas Sen is a Computer Science & AI Engineer at IIIT Guwahati specializing in full-stack architecture, agent orchestration (LangGraph), and scalable RAG pipelines with Qdrant and Docker. Feel free to ask about his system architecture, projects, or problem-solving experience!";
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

      let replyText = "";
      let modelUsed = "gemini-3.5-flash";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          if (data && data.text) {
            replyText = data.text;
            modelUsed = data.modelUsed || modelUsed;
          } else {
            replyText = getClientPortfolioReply(userText);
            modelUsed = "portfolio-engine";
          }
        } else {
          // Non-JSON response (e.g., static server preview or HTML 404 in production)
          replyText = getClientPortfolioReply(userText);
          modelUsed = "portfolio-engine";
        }
      } catch {
        // Fetch failed due to network / CORS / offline
        replyText = getClientPortfolioReply(userText);
        modelUsed = "portfolio-engine";
      }

      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
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
                    {isUser ? (
                      <div className="whitespace-pre-wrap font-sans">{m.text}</div>
                    ) : (
                      <FormattedMarkdown content={m.text} />
                    )}
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
