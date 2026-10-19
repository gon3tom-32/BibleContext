// Renders content text where *word* means italic (used for transliterated words).
export default function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? <i key={i}>{part.slice(1, -1)}</i> : part,
      )}
    </>
  );
}
