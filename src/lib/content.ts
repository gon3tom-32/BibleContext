// Reads book content from /content/<slug>/ at build time.
// Adding a book means adding a folder there, not code.
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Hand-written content carries this until someone has checked it. */
export type Review = { status: "needs-review" | "reviewed"; note?: string };

export type Book = {
  review?: Review;
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
  /** Overrides the book's "What was happening" fact in the Setting the scene strip. */
  sceneHappening?: string;
  questions: string[];
  /** Key words for this chapter, with what the word is doing here. */
  words: { id: string; note: string }[];
  crossRefs: { ref: string; note: string }[];
};

export type Word = {
  id: string;
  transliteration: string;
  /** Original-language form (Hebrew for Ruth). */
  original: string;
  /** Approximate, for English speakers. */
  pronunciation: string;
  gloss: string;
  notes: string;
  /** Shown with a "Debated" tag when the meaning or origin is uncertain. */
  uncertain?: string;
  range: { sense: string; note: string }[];
  /** How English Bibles commonly render it. */
  translations: string[];
  elsewhere: { ref: string; note: string }[];
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

export function getWord(slug: string, id: string): Word | undefined {
  return getWords(slug).find((w) => w.id === id);
}

/** Every written chapter of a book, in order. */
export function getChapters(slug: string): Chapter[] {
  const count = getBook(slug).chapterCount;
  return Array.from({ length: count }, (_, i) => getChapter(slug, i + 1)).filter(
    (c): c is Chapter => c !== null,
  );
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

// ---------- Generated data (scripts/pull-sources.mjs) ----------

export type Source = { name: string; url: string; license: string; fetched: string; item?: string; alsoCredit?: string };

export type ChapterText = {
  number: number;
  translation: string;
  paragraphs: { verse: number; text: string; continued?: boolean }[][];
  source: Source;
};

export type PlaceData = {
  id: string;
  name: string;
  type?: string;
  mentionedIn: string[];
  mapOnly: boolean;
  identification: string;
  modernLocation?: string;
  lonlat: [number, number] | null;
  confidence: { score: number | null; outOf: number; label: string };
  outline: { type: string; coordinates: unknown; kind: string; osm?: boolean } | null;
  source: Source;
};

type PersonRef = { name: string; id?: string };
export type PersonData = {
  id: string;
  name: string;
  alsoCalled?: string;
  gender?: string;
  family: { father?: PersonRef; mother?: PersonRef; spouses: PersonRef[]; children: PersonRef[]; siblings: PersonRef[] };
  chapters: number[];
  verses: string[];
  source: Source;
};

export type WordData = {
  id: string;
  strongs: string[];
  lexicon: { strongs: string; hebrew: string; transliteration: string; partOfSpeech: string; gloss: string; meaning: string }[];
  formsInBook: { hebrew: string; translit: string; gloss: string }[];
  occurrencesInBook: string[];
  hebrewBibleCount: number;
  source: Source;
};

export type CrossRefData = {
  number: number;
  suggested: { ref: string; from: string[]; votes: number; source: Source }[];
  handPickedCheck: { ref: string; inDataset: boolean; votes: number }[];
};

export type SourceInfo = {
  id: string;
  name: string;
  provides: string;
  homepage: string;
  repo?: string;
  commit?: string;
  license: string;
  licenseUrl: string;
  notes?: string;
  modifications?: string;
};

function readGenerated<T>(slug: string, file: string, key: string): T | null {
  if (!exists(slug, "generated", file)) return null;
  return (readJson<Record<string, unknown>>(slug, "generated", file)[key] as T) ?? null;
}

export function getChapterText(slug: string, n: number): ChapterText | null {
  return readGenerated<ChapterText[]>(slug, "text.json", "chapters")?.find((c) => c.number === n) ?? null;
}

export function getPlaceData(slug: string): PlaceData[] {
  return readGenerated<PlaceData[]>(slug, "places.json", "places") ?? [];
}

export function getPeopleData(slug: string): PersonData[] {
  return readGenerated<PersonData[]>(slug, "people.json", "people") ?? [];
}

export function getWordData(slug: string, id: string): WordData | null {
  return readGenerated<WordData[]>(slug, "words.json", "words")?.find((w) => w.id === id) ?? null;
}

export function getCrossRefData(slug: string, n: number): CrossRefData | null {
  return readGenerated<CrossRefData[]>(slug, "crossrefs.json", "chapters")?.find((c) => c.number === n) ?? null;
}

export function getSources(): { fetched: string; sources: SourceInfo[] } {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts/data/sources.json"), "utf8"));
}

/** One-line family summary, e.g. "Married to Elimelech · Children: Mahlon, Chilion". */
export function familyLine(p: PersonData): string[] {
  const names = (xs: PersonRef[]) => xs.map((x) => x.name).join(", ");
  const parents = [p.family.father, p.family.mother].filter(Boolean) as PersonRef[];
  return [
    parents.length ? `Parents: ${names(parents)}` : "",
    p.family.spouses.length ? `Married to: ${names(p.family.spouses)}` : "",
    p.family.children.length ? `Children: ${names(p.family.children)}` : "",
    p.family.siblings.length ? `Siblings: ${names(p.family.siblings)}` : "",
  ].filter(Boolean);
}
