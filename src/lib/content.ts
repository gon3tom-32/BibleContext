// Reads book content from /content/<slug>/ at build time.
// Adding a book means adding a folder there, not code.
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Book = {
  slug: string;
  title: string;
  chapterCount: number;
  tagline: string;
  author: string;
  authorNote: string;
  authorDebated?: boolean;
  audience: string;
  audienceNote: string;
  setting: string;
  settingNote: string;
  genre: string;
  genreNote: string;
  bigIdea: string;
  themes: string[];
  mapTitle: string;
  mapSummary: string;
  scene: { author: string; audience: string; happening: string };
  overviewPeople: string[];
};

export type Person = { id: string; name: string; note: string; chapters: number[] };
export type Place = { id: string; name: string; note: string };

export type Chapter = {
  number: number;
  summary: string;
  whySettingMatters: string;
  people: { id: string; note: string }[];
  questions: string[];
  wordIds: string[];
  crossRefs: { ref: string; note: string }[];
};

export type Word = {
  id: string;
  transliteration: string;
  original: string;
  gloss: string;
  summary: string;
  notes: string;
  occurrences: string[];
};

export type Stop = {
  order: number;
  placeId: string;
  title: string;
  short: string;
  refs: string;
  text: string;
  direction: "out" | "back";
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  labelAnchor: "start" | "middle" | "end";
};

export type MapData = {
  title: string;
  viewBox: string;
  label: string;
  water: { d: string; label: string; labelX: number; labelY: number }[];
  rivers: { d: string; label: string; labelX: number; labelY: number }[];
  routes: { direction: "out" | "back"; d: string; label: string }[];
  stops: Stop[];
  chapter: number;
};

export type Era = { id: string; label: string; order: number };
export type TimelineEvent = {
  lane: "israel" | "neighbors" | "book";
  eraId: string;
  text: string;
  highlight?: boolean;
};
export type Timeline = {
  title: string;
  eras: Era[];
  focusEraId: string;
  lanes: { id: TimelineEvent["lane"]; label: string }[];
  events: TimelineEvent[];
  teaser: { title: string; text: string; tone: "green" | "gold" | "ink" }[];
};

function readJson<T>(...parts: string[]): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, ...parts), "utf8")) as T;
}

function exists(...parts: string[]) {
  return fs.existsSync(path.join(CONTENT_DIR, ...parts));
}

export function getBookSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && exists(d.name, "book.json"))
    .map((d) => d.name);
}

export function getBook(slug: string): Book {
  return readJson<Book>(slug, "book.json");
}

export function getPeople(slug: string): Person[] {
  return readJson<Person[]>(slug, "people.json");
}

export function getPlaces(slug: string): Place[] {
  return readJson<Place[]>(slug, "places.json");
}

export function getWords(slug: string): Word[] {
  return exists(slug, "words.json") ? readJson<Word[]>(slug, "words.json") : [];
}

export function getMap(slug: string): MapData {
  const map = readJson<MapData>(slug, "map.json");
  map.stops.sort((a, b) => a.order - b.order);
  return map;
}

export function getTimeline(slug: string): Timeline {
  const t = readJson<Timeline>(slug, "timeline.json");
  t.eras.sort((a, b) => a.order - b.order);
  return t;
}

/** Returns null when the chapter hasn't been written yet. */
export function getChapter(slug: string, n: number): Chapter | null {
  return exists(slug, "chapters", `${n}.json`)
    ? readJson<Chapter>(slug, "chapters", `${n}.json`)
    : null;
}

/** Link out to a public-domain translation (World English Bible). */
export function scriptureUrl(ref: string) {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=WEB`;
}
