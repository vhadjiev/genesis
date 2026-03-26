/**
 * Parses headline text into React nodes with gradient and line break support.
 *
 * Supports two gradient conventions:
 * 1. Asterisk syntax: *word* → <span className="text-gradient">word</span>
 * 2. Substring match: gradientSubstring param highlights a specific phrase
 *
 * Line breaks: \n → <br />
 *
 * If both are provided, asterisk syntax takes priority.
 */
export function parseHeadline(
  text: string,
  gradientSubstring?: string
): React.ReactNode {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Check for *asterisk* syntax first
    if (line.includes("*")) {
      const parts = line.split(/(\*[^*]+\*)/g);
      return (
        <span key={lineIdx}>
          {parts.map((part, partIdx) => {
            if (part.startsWith("*") && part.endsWith("*")) {
              return (
                <span key={partIdx} className="text-gradient">
                  {part.slice(1, -1)}
                </span>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    }

    // Fall back to substring matching
    if (gradientSubstring && line.includes(gradientSubstring)) {
      const idx = line.indexOf(gradientSubstring);
      const before = line.slice(0, idx);
      const after = line.slice(idx + gradientSubstring.length);
      return (
        <span key={lineIdx}>
          {before}
          <span className="text-gradient">{gradientSubstring}</span>
          {after}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    }

    // Plain line
    return (
      <span key={lineIdx}>
        {line}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}
