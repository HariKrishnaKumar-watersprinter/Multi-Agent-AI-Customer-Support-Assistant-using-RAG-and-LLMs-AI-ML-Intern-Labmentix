import { FaRobot, FaUser } from "react-icons/fa6"; // Added FaUser

// Turns **bold** markers inside a line into real <strong> text.
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

// Groups raw message text into paragraph / bullet-list / numbered-list blocks
// instead of dumping everything as one pre-wrapped blob.
type BlockType = "p" | "ul" | "ol";
interface ContentBlock {
  type: BlockType;
  lines: string[];
}

function formatContent(content: string) {
  const lines = content.split("\n");
  const blocks: ContentBlock[] = [];
  let buffer: string[] = [];
  let bufferType: BlockType | null = null;

  const flush = () => {
    if (buffer.length === 0) return;
    if (bufferType !== null) {
      blocks.push({ type: bufferType, lines: buffer });
    }
    buffer = [];
    bufferType = null;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (line === "") {
      flush();
      return;
    }

    const bulletMatch = line.match(/^[-•*]\s+(.*)/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.*)/);

    if (bulletMatch) {
      if (bufferType !== "ul") flush();
      bufferType = "ul";
      buffer.push(bulletMatch[1]);
    } else if (numberedMatch) {
      if (bufferType !== "ol") flush();
      bufferType = "ol";
      buffer.push(numberedMatch[1]);
    } else {
      if (bufferType !== "p") flush();
      bufferType = "p";
      buffer.push(line);
    }
  });
  flush();

  return blocks;
}

function FormattedContent({ content }: { content: any }) {
  // Never let bad/missing content crash the bubble and hide a real answer.
  let safeContent = "";
  if (typeof content === "string") {
    safeContent = content;
  } else if (content !== undefined && content !== null) {
    try {
      safeContent = typeof content === "object" ? JSON.stringify(content) : String(content);
    } catch {
      safeContent = "";
    }
  }

  if (safeContent.trim() === "") {
    return <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>(empty response)</p>;
  }

  let blocks;
  try {
    blocks = formatContent(safeContent);
  } catch {
    // Fall back to plain text rather than showing nothing
    return <p className="whitespace-pre-wrap">{safeContent}</p>;
  }

  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        if (block.type === "ul") {
          return (
            <ul key={bi} className="list-disc pl-5 space-y-1">
              {block.lines.map((line, li) => (
                <li key={li}>{renderInline(line, `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={bi} className="list-decimal pl-5 space-y-1">
              {block.lines.map((line, li) => (
                <li key={li}>{renderInline(line, `${bi}-${li}`)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bi}>
            {block.lines.map((line, li) => (
              <span key={li}>
                {renderInline(line, `${bi}-${li}`)}
                {li < block.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

interface Message {
  role: "user" | "assistant" | string;
  content: any;
  agents?: string[];
  isError?: boolean; // Added this to support error states
}

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg?.role === "user";
  const animationClass = isUser ? "animate-slide-right" : "animate-slide-left";
  
  // Check if this specific message is an error
  const hasError = msg?.isError === true;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5 ${animationClass}`}>
      {/* Assistant avatar (Left Side) */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-[7px] flex items-center justify-center text-xs flex-shrink-0 mr-2.5"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#171100' }}
        >
          <FaRobot />
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        
        {/* Human avatar (Above User Message) */}
        {isUser && (
          <div
            className="w-8 h-8 rounded-[7px] flex items-center justify-center text-xs flex-shrink-0 mb-1.5"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff' }}
          >
            <FaUser />
          </div>
        )}

        {/* Agent routing tags */}
        {!isUser && msg?.agents && (
          <div className="flex items-center gap-1.5 mb-1.5 ml-0.5 flex-wrap">
            {msg.agents.map((a, i) => (
              <span key={a} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[10px]" style={{ color: 'var(--muted)' }}>→</span>}
                <span
                  className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-[3px]"
                  style={{ color: 'var(--accent2)', background: 'rgba(95,184,174,0.1)', border: '1px solid rgba(95,184,174,0.2)', fontFamily: 'var(--font-mono)' }}
                >
                  {a}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* The bubble */}
        <div
          className="px-5 py-3.5 text-[15px] leading-relaxed shadow-sm"
          style={isUser ? {
            background: 'var(--surface2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius) var(--radius) 3px var(--radius)',
          } : {
            // FIX: Split border into individual sides to prevent React "borderLeft" conflict warning
            // FIX: Added dynamic red styling if hasError is true
            background: hasError ? 'rgba(252, 108, 143, 0.08)' : 'var(--surface)',
            color: hasError ? 'var(--accent2)' : 'var(--text)',
            borderTop: hasError ? '1px solid rgba(252, 108, 143, 0.4)' : '1px solid var(--border)',
            borderRight: hasError ? '1px solid rgba(252, 108, 143, 0.4)' : '1px solid var(--border)',
            borderBottom: hasError ? '1px solid rgba(252, 108, 143, 0.4)' : '1px solid var(--border)',
            borderLeft: hasError ? '1px solid rgba(252, 108, 143, 0.4)' : '2px solid var(--accent2)', 
            borderRadius: '3px var(--radius) var(--radius) var(--radius)',
          }}
        >
          <FormattedContent content={msg?.content} />
        </div>
      </div>
    </div>
  );
}