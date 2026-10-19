"use client";

import { useEffect, useId, useState } from "react";
import { addNote, deleteNote, getAuthor, listNotes, setAuthor, subscribe, type Note } from "@/lib/notes";

type Props = {
  book: string;
  /** Omit to show and add notes for the whole book. */
  chapter?: number;
  /** Show which chapter each note belongs to (used on the all-notes page). */
  showChapter?: boolean;
  compact?: boolean;
};

const dateFmt = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" });

export default function Notes({ book, chapter, showChapter, compact }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthorState] = useState("");
  const textId = useId();
  const authorId = useId();

  useEffect(() => {
    const load = () => setNotes(listNotes(book, chapter));
    load();
    setAuthorState(getAuthor());
    return subscribe(load);
  }, [book, chapter]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const who = author.trim() || "Us";
    setAuthor(author.trim());
    addNote({ book, chapter, author: who, text: t });
    setText("");
  }

  return (
    <div className="stack gap-12">
      <form onSubmit={save} className="stack gap-12">
        <label htmlFor={textId} className="field-label">Questions we&rsquo;re wrestling with</label>
        <textarea
          id={textId}
          rows={compact ? 4 : 5}
          placeholder="Add a question or thought"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label htmlFor={authorId} className="field-label">Written by (optional)</label>
        <input id={authorId} type="text" value={author} autoComplete="given-name" onChange={(e) => setAuthorState(e.target.value)} placeholder="Your name" />
        <button type="submit" className="btn btn--solid btn--sm" style={{ alignSelf: "flex-start" }}>Save note</button>
        <p className="hint">Saved in this browser only, for now.</p>
      </form>

      {notes.length > 0 && (
        <ul className="note-list" aria-label="Saved notes">
          {notes.map((n) => (
            <li key={n.id} className="note-item">
              <div className="note-meta">
                <span>
                  {n.author} · {dateFmt.format(new Date(n.createdAt))}
                  {showChapter && (n.chapter ? ` · Chapter ${n.chapter}` : " · Whole book")}
                </span>
                <button type="button" className="text-btn" onClick={() => deleteNote(n.id)} aria-label={`Delete note from ${n.author}`}>
                  Delete
                </button>
              </div>
              <p className="note-text">{n.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
