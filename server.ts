import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Knowledge base helper for resilient responses
function getPortfolioKnowledgeReply(userQuery: string): string {
  const query = userQuery.toLowerCase();

  if (query.includes("langgraph") || query.includes("agent")) {
    return "### Experience with LangGraph & Multi-Agent Systems\n\nAbhas has designed and implemented multi-agent architectures using **LangGraph** and **LangChain**:\n- **Multi-Agent Code Evaluation**: Built autonomous loops incorporating AST validation, lint verification, and tree-sitter context parsing for automated code review.\n- **Orchestration**: Coordinated stateful graphs with conditional branching, error-recovery nodes, and memory persistence.\n- **Production Results**: Reduced review turnaround time by 64% and improved automated test coverage generation.";
  }

  if (query.includes("rag") || query.includes("retrieval") || query.includes("vector") || query.includes("qdrant")) {
    return "### RAG & Semantic Retrieval Architecture\n\nAbhas's RAG system architecture:\n- **Hybrid Dense & Sparse Search**: Combines **Qdrant** vector indexing with BM25 sparse keyword ranking.\n- **Cross-Encoder Reranking**: Applies cross-encoder reranking to ensure sub-50ms query latency with high top-k precision over 2.4M technical documents.\n- **Document Ingestion**: Multi-document ingestion pipeline querying 1000+ pages of PDFs, cutting retrieval turnaround time by 70%.";
  }

  if (query.includes("coding platform") || query.includes("docker") || query.includes("intelligent")) {
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

// Multi-turn Gemini chat API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, taskComplexity } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid messages payload." });
    }

    const lastUserMsg = messages[messages.length - 1]?.text || "";

    // Model selection based on user requirements:
    let model = "gemini-3.5-flash";
    if (taskComplexity === "complex") {
      model = "gemini-3.1-pro-preview";
    } else if (taskComplexity === "fast") {
      model = "gemini-3.1-flash-lite";
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If apiKey is not available, return verified domain knowledge reply immediately
    if (!apiKey) {
      return res.json({
        text: getPortfolioKnowledgeReply(lastUserMsg),
        modelUsed: `${model} (portfolio engine)`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format conversation history for Gemini multi-turn generateContent
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const systemInstruction = `You are the personal AI Engineering Assistant & Technical Representative for Abhas Sen's Developer Portfolio.
Abhas Sen is a Computer Science Engineering student at Indian Institute of Information Technology, Guwahati (IIITG, B.Tech CSE 2023-2027, CGPA 7.63).
Key profile details:
- Buildspace Season 5 Fellow.
- Solved 450+ coding problems on LeetCode across dynamic programming, graphs, trees, and sliding window.
- Intelligent AI Coding Platform: Full-stack AI-powered coding platform with isolated Docker developer workspaces, Monaco editor, and scalable Celery + Qdrant RAG pipeline.
- Explainable AI (XAI): ML/DL models (CNN-LSTM, SVM, DNN) with SHAP and LIME algorithms for real-time model interpretability.
- DrawSync: Multi-user whiteboard with WebSockets, PostgreSQL, and Gemini AI shape suggestions.
- Generative AI Projects: Voice-enabled coding assistant, multi-document RAG querying 1000+ pages of PDFs (cutting retrieval time by 70%), domain fine-tuned LLM (+25% accuracy).
- GitHub: https://github.com/abhassen44
- LinkedIn: https://www.linkedin.com/in/abhas-sen-1a0862282/
- LeetCode: https://leetcode.com/abhassen44
- Email: abhassen44@gmail.com
- Resume: https://drive.google.com/file/d/1989kYQ8f7JAeh13pbDGS9icrlevHuHmB/view?usp=sharing

Guidelines:
1. Answer technical questions about Abhas's architecture, projects, skills, education, and career experience accurately and concisely.
2. Be direct, articulate, and professional. Use clean markdown formatting.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || getPortfolioKnowledgeReply(lastUserMsg);

      return res.json({
        text: replyText,
        modelUsed: model,
      });
    } catch (apiErr: any) {
      console.warn("Gemini API call failed, using resilient knowledge reply:", apiErr?.message);
      return res.json({
        text: getPortfolioKnowledgeReply(lastUserMsg),
        modelUsed: `${model} (fallback)`,
      });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const lastUserMsg = req.body?.messages?.[req.body.messages.length - 1]?.text || "";
    return res.json({
      text: getPortfolioKnowledgeReply(lastUserMsg),
      modelUsed: "portfolio-resilience-engine",
    });
  }
});

// Direct routes to serve the resume PDF reliably
app.use(express.static(path.resolve("public")));

app.get(["/Abhas_Sen_Resume.pdf", "/resume.pdf"], (req, res) => {
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(path.resolve("public/Abhas_Sen_Resume.pdf"));
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
