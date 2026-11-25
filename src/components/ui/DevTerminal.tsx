import { useState, type FormEvent } from "react";
import { TerminalSquare, X } from "lucide-react";
import { profile } from "@/data/profile";

const WELCOME = "Type 'help' to see available commands.";

function runCommand(raw: string): string {
  const cmd = raw.trim().toLowerCase();
  switch (cmd) {
    case "help":
      return "Commands: whoami, skills, experience, contact, clear";
    case "whoami":
      return `${profile.name} — ${profile.role}. ${profile.summary}`;
    case "skills":
      return "PHP/Laravel, Node.js, Python/FastAPI, React/Vue/Next/Nuxt, Shopify, MySQL/GraphQL, Linux infrastructure.";
    case "experience":
      return `${profile.yearsExperience}+ years across schools, industry, and e-commerce. See the Experience section for the full timeline.`;
    case "contact":
      return `Reach me at ${profile.email} or via the Contact section below.`;
    case "clear":
      return "__CLEAR__";
    case "":
      return "";
    default:
      return `command not found: ${raw}. Type 'help'.`;
  }
}

export default function DevTerminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([WELCOME]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = runCommand(input);
    if (result === "__CLEAR__") {
      setLines([]);
    } else {
      setLines((prev) => [...prev, `$ ${input}`, result].filter(Boolean));
    }
    setInput("");
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {open ? (
        <div className="glass-panel w-80 max-w-[85vw] rounded-2xl p-4 font-mono text-xs text-mist">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-paper">developer@portfolio:~</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close terminal">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div aria-live="polite" className="mb-2 max-h-40 space-y-1 overflow-y-auto">
            {lines.map((line, i) => (
              <p key={i} className={line.startsWith("$") ? "text-sky" : ""}>
                {line}
              </p>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-violet">
              &gt;
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Terminal command input"
              className="w-full bg-transparent text-paper outline-none"
              placeholder="help"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open developer terminal easter egg"
          className="glass-panel rounded-full p-3 text-mist transition-colors hover:text-paper"
        >
          <TerminalSquare className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
