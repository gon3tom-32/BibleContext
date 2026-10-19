// Notes are user data, not content. Phase 1 keeps them in this browser only.
// Phase 2 swaps this file's internals for Supabase; components keep the same calls.

export type Note = {
  id: string;
  book: string;
  chapter?: number;
  author: string;
  text: string;
  createdAt: string;
};

const KEY = "passage-explorer:notes";
const AUTHOR_KEY = "passage-explorer:author";
const EVENT = "passage-explorer:notes-changed";

function readAll(): Note[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

function writeAll(notes: Note[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(notes));
  } catch {
    // Storage may be blocked (private mode). Notes then last only for this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function listNotes(book: string, chapter?: number): Note[] {
  return readAll()
    .filter((n) => n.book === book && (chapter === undefined || n.chapter === chapter))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addNote(input: Omit<Note, "id" | "createdAt">): Note {
  const note: Note = {
    ...input,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  writeAll([note, ...readAll()]);
  return note;
}

export function deleteNote(id: string) {
  writeAll(readAll().filter((n) => n.id !== id));
}

export function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function getAuthor(): string {
  try {
    return window.localStorage.getItem(AUTHOR_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setAuthor(name: string) {
  try {
    window.localStorage.setItem(AUTHOR_KEY, name);
  } catch {}
}
