/**
 * Central Portfolio Configuration
 * Updated with verified details from Abhas Sen's resume & portfolio
 * GitHub remains the dynamic source of truth for repository data.
 */

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  period: string;
  grade?: string;
  details: string[];
  coursework: string[];
}

export const portfolioConfig = {
  name: "Abhas Sen",
  title: "Computer Science Engineer · Full Stack & AI",
  tagline: "Computer Science Engineering student at IIIT Guwahati specializing in full-stack development, artificial intelligence, and scalable cloud architectures.",
  location: "Guwahati, Assam / Jabalpur, MP",
  status: "Available for engineering roles & technical collaborations",
  phone: "+91 9826505141",
  photo: "/abhassen.jpeg", // verified photo from user upload / portfolio

  github: {
    username: "abhassen44",
    defaultPerPage: 30,
  },

  social: {
    github: "https://github.com/abhassen44",
    linkedin: "https://www.linkedin.com/in/abhas-sen-1a0862282/",
    leetcode: "https://leetcode.com/abhassen44",
    x: "https://x.com/ASSASIN_IV",
    email: "abhassen44@gmail.com",
  },

  resume: "https://drive.google.com/file/d/1989kYQ8f7JAeh13pbDGS9icrlevHuHmB/view?usp=sharing",

  // Repository names to prioritize at the top of the project showcase
  featuredRepositories: [
    "Intelligent-AI-Coding-Platform",
    "Explainable-AI-Project",
    "DrawSync",
    "Generative-AI-Projects",
    "ai-coding-agent",
    "rag-search-engine"
  ],

  about: {
    headline: "Computer Science Engineering student specializing in full-stack development and artificial intelligence.",
    bio: [
      "As a dedicated Computer Science Engineering student at IIIT Guwahati, I combine academic excellence with practical experience in modern software development. My expertise spans full-stack web development, artificial intelligence, and cloud technologies.",
      "Through hands-on projects and professional internships, I've developed proficiency in building scalable applications, implementing AI-driven solutions, and collaborating effectively in cross-functional teams. I'm passionate about leveraging technology to solve complex problems and create meaningful user experiences."
    ],
    competencies: [
      "Full-Stack Web Development (React, Next.js, Node.js, Python)",
      "Machine Learning & AI Implementation (LangChain, LangGraph, RAG)",
      "Database Design & Management (PostgreSQL, MongoDB Atlas, Qdrant, Neo4j)",
      "Cloud Computing & DevOps Practices (AWS, Docker, K8s, CI/CD)",
      "Agile Development Methodologies & Problem Solving (450+ LeetCode)",
      "Technical Leadership, Cross-Functional Collaboration & GSAP Animations"
    ],
    highlights: [
      { label: "Institution", value: "IIIT Guwahati (B.Tech CSE)" },
      { label: "LeetCode Solved", value: "450+ Problems (DP, Graphs, Trees)" },
      { label: "Fellowship", value: "Buildspace Season 5 Fellow" },
      { label: "Core Stack", value: "React, Next.js, Python, FastAPI, Docker" }
    ]
  },

  skills: {
    languages: [
      { name: "JavaScript", level: "Core & Modern ESNext" },
      { name: "TypeScript", level: "Strict Full-Stack Architecture" },
      { name: "Python", level: "AI/ML Ecosystem & Scripting" },
      { name: "C++", level: "Data Structures & Algorithms" },
      { name: "C", level: "Systems Fundamentals" },
      { name: "Java", level: "Object-Oriented Programming" }
    ],
    frontend: [
      { name: "React", level: "Hooks & Component Architecture" },
      { name: "Next.js", level: "App Router & Full-Stack SSR" },
      { name: "Tailwind CSS", level: "Design Systems & Zero-Slop Styling" },
      { name: "Three.js", level: "Interactive 3D & WebGL" },
      { name: "GSAP", level: "ScrollTrigger & Kinetic Motion" },
      { name: "WebSockets", level: "Real-time Multi-user Canvas" }
    ],
    backend: [
      { name: "FastAPI", level: "Async Python Services" },
      { name: "Node.js", level: "Runtime Execution" },
      { name: "Express.js", level: "RESTful Web APIs" },
      { name: "AuthJS", level: "Authentication & OAuth" },
      { name: "Celery", level: "Asynchronous Background Workers" }
    ],
    aiMl: [
      { name: "LangChain & LangGraph", level: "Multi-Agent Orchestration" },
      { name: "RAG Pipelines", level: "Hybrid Vector Search & Qdrant" },
      { name: "LLM Fine-Tuning", level: "Domain Adaptation & Evaluation" },
      { name: "TensorFlow & Scikit-learn", level: "Deep & Classical ML Models" },
      { name: "Explainable AI (XAI)", level: "SHAP & LIME Interpretability" }
    ],
    infrastructure: [
      { name: "Docker", level: "Containerization & Sandboxing" },
      { name: "Kubernetes (K8s)", level: "Container Orchestration" },
      { name: "PostgreSQL", level: "Relational Modeling & Indexing" },
      { name: "MongoDB Atlas", level: "Document Store" },
      { name: "Qdrant", level: "High-Performance Vector DB" },
      { name: "Neo4j", level: "Graph Database" },
      { name: "AWS, Vercel & Render", level: "Cloud Hosting & CI/CD" }
    ]
  },

  experience: [
    {
      company: "Buildspace",
      role: "Fellowship — Remote",
      period: "June 2024 – July 2024",
      location: "San Francisco, USA (Remote)",
      description: [
        "Full-Stack Development: Built and deployed production features using the MERN stack (MongoDB Atlas, Express.js, React.js, Node.js) with smooth frontend–backend integration.",
        "UI/UX Enhancements: Elevated user experience by implementing Material UI components and GSAP animations, creating a modern and intuitive interface.",
        "Collaborated with builders globally in Buildspace Season 5, shipping rapid prototypes and gathering live user feedback."
      ],
      technologies: ["MongoDB Atlas", "Express.js", "React.js", "Node.js", "GSAP", "Material UI"]
    }
  ] as ExperienceItem[],

  education: [
    {
      institution: "Indian Institute of Information Technology, Guwahati (IIITG)",
      degree: "B.Tech",
      field: "Computer Science and Engineering",
      period: "Aug 2023 – May 2027",
      grade: "CGPA: 7.63 / 10.0",
      details: [
        "Specializing in full-stack development, artificial intelligence, and scalable cloud systems.",
        "Active member of campus technical initiatives and competitive programming community.",
        "Solved 450+ algorithmic problems across LeetCode covering dynamic programming, graphs, and trees."
      ],
      coursework: [
        "Data Structures and Algorithms",
        "Operating Systems",
        "Database Management Systems",
        "Computer Networks",
        "Object Oriented Programming",
        "Theory of Computation"
      ]
    },
    {
      institution: "Kendriya Vidyalaya 1STC Jabalpur",
      degree: "Schooling (1st–12th)",
      field: "Science Stream (PCM)",
      period: "Aug 2011 – May 2023",
      details: [
        "Completed higher secondary education with strong foundation in mathematics and physics.",
        "Actively participated in football and badminton tournaments, fostering discipline, teamwork, and leadership."
      ],
      coursework: ["Physics", "Chemistry", "Mathematics", "Computer Science"]
    }
  ] as EducationItem[],

  achievements: [
    "Solved 450+ coding problems on LeetCode (DP, graphs, sliding window, binary search, trees).",
    "Buildspace Season 5 Fellow.",
    "Actively participate in football and badminton, fostering teamwork, discipline, and strategic thinking."
  ]
};
