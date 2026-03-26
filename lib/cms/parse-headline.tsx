/**
 * Parses headline text with two conventions:
 * - Line breaks: \n → <br />
 * - Gradient text: *word* → <span className="text-gradient">word</span>
 *
 * Used by ContentCard for cta-centered and hero layouts.
 */
export function parseHeadline(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
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
  });
}
