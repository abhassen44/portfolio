import React from "react";

interface FormattedMarkdownProps {
  content: string;
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({ content }) => {
  // Split content by paragraphs / blocks
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Heading 3: ### Title
        if (trimmed.startsWith("### ")) {
          const title = trimmed.replace("### ", "");
          return (
            <div
              key={idx}
              className="font-mono font-bold text-xs uppercase tracking-wider text-[#166534] dark:text-[#22C55E] pt-1 border-b border-[#DDE8E1] dark:border-[#1B3022] pb-1"
            >
              {title}
            </div>
          );
        }

        // Bullet point: - **Category**: details
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletContent = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-none bg-[#166534] dark:bg-[#22C55E] shrink-0 mt-1.5" />
              <div className="flex-1">
                {renderInlineFormattedText(bulletContent)}
              </div>
            </div>
          );
        }

        // Regular line / paragraph
        return <div key={idx}>{renderInlineFormattedText(trimmed)}</div>;
      })}
    </div>
  );
};

// Parses bold (**text**), inline links ([label](url)), and code (`code`)
function renderInlineFormattedText(text: string): React.ReactNode {
  // Regex to match markdown links [text](url) and bold **text** and code `text`
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|\`.*?\`)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[#111827] dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="font-mono text-[11px] px-1 py-0.5 bg-[#EAF2ED] dark:bg-[#1B3022] text-[#166534] dark:text-[#22C55E]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#166534] dark:text-[#22C55E] underline hover:opacity-80"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}
