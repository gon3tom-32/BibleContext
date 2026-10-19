// Pulls data for one book from the cached sources into content/<book>/generated/.
// Run scripts/fetch-sources.sh first. Usage: node scripts/pull-sources.mjs ruth
//
// Every generated item carries a `source` field. Hand-written content (summaries,
// context notes, stops, timeline) is never touched here.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CACHE = path.join(ROOT, ".cache/sources");
const slug = process.argv[2] ?? "ruth";
const BOOK_DIR = path.join(ROOT, "content", slug);
const OUT_DIR = path.join(BOOK_DIR, "generated");
const cfg = JSON.parse(fs.readFileSync(path.join(BOOK_DIR, "sources.config.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/data/sources.json"), "utf8"));
const FETCHED = registry.fetched;
const SRC = Object.fromEntries(registry.sources.map((s) => [s.id, s]));

const gaps = []; // things the sources don't cover, or problems found while pulling
const gap = (area, text) => gaps.push({ area, text });

function source(id, extra = {}) {
  const s = SRC[id];
  return { name: s.name, url: s.homepage, license: s.license, fetched: FETCHED, ...extra };
}

// ---------- Reference helpers ----------
// OSIS book code -> English name
const OSIS = {
  Gen: "Genesis", Exod: "Exodus", Lev: "Leviticus", Num: "Numbers", Deut: "Deuteronomy", Josh: "Joshua",
  Judg: "Judges", Ruth: "Ruth", "1Sam": "1 Samuel", "2Sam": "2 Samuel", "1Kgs": "1 Kings", "2Kgs": "2 Kings",
  "1Chr": "1 Chronicles", "2Chr": "2 Chronicles", Ezra: "Ezra", Neh: "Nehemiah", Esth: "Esther", Job: "Job",
  Ps: "Psalm", Prov: "Proverbs", Eccl: "Ecclesiastes", Song: "Song of Songs", Isa: "Isaiah", Jer: "Jeremiah",
  Lam: "Lamentations", Ezek: "Ezekiel", Dan: "Daniel", Hos: "Hosea", Joel: "Joel", Amos: "Amos", Obad: "Obadiah",
  Jonah: "Jonah", Mic: "Micah", Nah: "Nahum", Hab: "Habakkuk", Zeph: "Zephaniah", Hag: "Haggai", Zech: "Zechariah",
  Mal: "Malachi", Matt: "Matthew", Mark: "Mark", Luke: "Luke", John: "John", Acts: "Acts", Rom: "Romans",
  "1Cor": "1 Corinthians", "2Cor": "2 Corinthians", Gal: "Galatians", Eph: "Ephesians", Phil: "Philippians",
  Col: "Colossians", "1Thess": "1 Thessalonians", "2Thess": "2 Thessalonians", "1Tim": "1 Timothy",
  "2Tim": "2 Timothy", Titus: "Titus", Phlm: "Philemon", Heb: "Hebrews", Jas: "James", "1Pet": "1 Peter",
  "2Pet": "2 Peter", "1John": "1 John", "2John": "2 John", "3John": "3 John", Jude: "Jude", Rev: "Revelation",
};
// STEPBible book code -> English name (Old Testament)
const STEP = {
  Gen: "Genesis", Exo: "Exodus", Lev: "Leviticus", Num: "Numbers", Deu: "Deuteronomy", Jos: "Joshua",
  Jdg: "Judges", Rut: "Ruth", "1Sa": "1 Samuel", "2Sa": "2 Samuel", "1Ki": "1 Kings", "2Ki": "2 Kings",
  "1Ch": "1 Chronicles", "2Ch": "2 Chronicles", Ezr: "Ezra", Neh: "Nehemiah", Est: "Esther", Job: "Job",
  Psa: "Psalm", Pro: "Proverbs", Ecc: "Ecclesiastes", Sng: "Song of Songs", Isa: "Isaiah", Jer: "Jeremiah",
  Lam: "Lamentations", Ezk: "Ezekiel", Dan: "Daniel", Hos: "Hosea", Jol: "Joel", Amo: "Amos", Oba: "Obadiah",
  Jon: "Jonah", Mic: "Micah", Nam: "Nahum", Hab: "Habakkuk", Zep: "Zephaniah", Hag: "Haggai", Zec: "Zechariah",
  Mal: "Malachi",
};
// STEPBible book code -> English name (New Testament)
Object.assign(STEP, {
  Mat: "Matthew", Mrk: "Mark", Luk: "Luke", Jhn: "John", Act: "Acts", Rom: "Romans", "1Co": "1 Corinthians",
  "2Co": "2 Corinthians", Gal: "Galatians", Eph: "Ephesians", Php: "Philippians", Col: "Colossians",
  "1Th": "1 Thessalonians", "2Th": "2 Thessalonians", "1Ti": "1 Timothy", "2Ti": "2 Timothy", Tit: "Titus",
  Phm: "Philemon", Heb: "Hebrews", Jas: "James", "1Pe": "1 Peter", "2Pe": "2 Peter", "1Jn": "1 John",
  "2Jn": "2 John", "3Jn": "3 John", Jud: "Jude", Rev: "Revelation",
});
const NAME_TO_STEP = Object.fromEntries(Object.entries(STEP).map(([k, v]) => [v, k]));
const GREEK = cfg.language === "Greek";
const bookName = OSIS[cfg.osis];

/** "Ruth.1.8" -> "Ruth 1:8"; "Prov.8.22-Prov.8.30" -> "Proverbs 8:22-30" */
function osisToReadable(ref) {
  const [a, b] = ref.split("-");
  const [bk, ch, v] = a.split(".");
  let out = `${OSIS[bk] ?? bk} ${ch}:${v}`;
  if (b) {
    const [bk2, ch2, v2] = b.split(".");
    out += bk2 === bk && ch2 === ch ? `-${v2}` : `-${ch2}:${v2}`;
  }
  return out;
}
/** Parse "Exodus 34:6" or "Leviticus 25:47-49" to { book, chapter, verses[] } */
function parseReadable(ref) {
  const m = ref.match(/^(.+?) (\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!m) return null;
  const [, book, ch, v1, v2] = m;
  if (!v1) return { book, chapter: +ch, verses: null };
  const vs = [];
  for (let v = +v1; v <= +(v2 ?? v1); v++) vs.push(v);
  return { book, chapter: +ch, verses: vs };
}

// ---------- 1. Text: World English Bible ----------
function pullText() {
  const raw = JSON.parse(fs.readFileSync(path.join(CACHE, "web/json", cfg.webFile), "utf8"));
  const chapters = new Map(); // chapter -> blocks [{ poetry?, verses: [{verse, text, continued?}] }]
  let block = null;
  let poetry = false;
  for (const item of raw) {
    const t = item.type;
    if (t === "paragraph start" || t === "stanza start") { block = null; poetry = t === "stanza start"; }
    else if (t === "paragraph end" || t === "stanza end") { block = null; poetry = false; }
    else if (t === "line break") { /* lines are already separate items */ }
    else if (t === "paragraph text" || t === "line text") {
      const ch = item.chapterNumber;
      if (!chapters.has(ch)) chapters.set(ch, []);
      const blocks = chapters.get(ch);
      if (!block || !blocks.includes(block)) {
        block = { ...(poetry ? { poetry: true } : {}), verses: [] };
        blocks.push(block);
      }
      const text = item.value.replace(/\s+/g, " ").trim();
      if (!text) continue;
      const sep = t === "line text" ? "\n" : " ";
      const last = block.verses[block.verses.length - 1];
      if (last && last.verse === item.verseNumber) last.text += sep + text;
      else {
        // A verse that carries on into a new paragraph is marked so its number isn't shown twice.
        const seen = blocks.some((b) => b !== block && b.verses.some((x) => x.verse === item.verseNumber));
        block.verses.push({ verse: item.verseNumber, text, ...(seen ? { continued: true } : {}) });
      }
    } else {
      gap("text", `Unrecognized item type "${t}" in the WEB file was skipped.`);
    }
  }
  for (const blocks of chapters.values()) {
    for (let k = blocks.length - 1; k >= 0; k--) if (!blocks[k].verses.length) blocks.splice(k, 1);
  }
  const out = [...chapters.keys()].map((number) => ({
    number,
    translation: "WEB",
    paragraphs: chapters.get(number),
    source: source("web", { item: `${bookName} ${number}` }),
  }));
  return { translation: { id: "WEB", name: "World English Bible", license: "Public domain" }, chapters: out };
}

// ---------- 2. Places: OpenBible geocoding ----------
function readJsonl(file, keep) {
  const out = new Map();
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    const d = JSON.parse(line);
    if (keep(d)) out.set(d.id, d);
  }
  return out;
}
const stripTags = (s) => (s ?? "").replace(/<[^>]+>/g, "");
function confidenceLabel(score) {
  // Scores are out of 1000 (see the dataset's readme, "Time-weighted scores").
  // The labels are our own plain-English reading of those numbers.
  if (score >= 800) return "High";
  if (score >= 500) return "Likely";
  if (score >= 200) return "Possible";
  return "Uncertain";
}
function roundCoords(c) {
  return Array.isArray(c[0]) ? c.map(roundCoords) : c.map((n) => Math.round(n * 1e4) / 1e4);
}
function pullPlaces() {
  const geoDir = path.join(CACHE, "openbible-geo");
  const ids = new Set(cfg.places.map((p) => p.ancientId));
  const ancient = readJsonl(path.join(geoDir, "data/ancient.jsonl"), (d) => ids.has(d.id));
  const geometryMeta = readJsonl(path.join(geoDir, "data/geometry.jsonl"), () => true);
  const places = [];
  for (const p of cfg.places) {
    const a = ancient.get(p.ancientId);
    if (!a) { gap("places", `OpenBible has no record ${p.ancientId} for "${p.id}".`); continue; }
    const verses = a.verses.map((v) => v.osis).filter((v) => v.startsWith(cfg.osis + "."));
    const type = a.types?.[0];
    // How the map draws this place: as a shape (water, river, region), a labeled town dot, or not at all.
    const mapRole = p.map ?? (["body of water", "river", "region"].includes(type) ? "shape" : p.mapOnly ? "town" : "none");
    if (!verses.length && !p.mapOnly) gap("places", `${a.friendly_id} has no ${bookName} verses in OpenBible.`);
    const best = Object.values(a.modern_associations).sort((x, y) => y.score - x.score)[0];
    const ident = a.identifications[0];
    const isRegion = a.types?.includes("region");
    // For a region, the modern association is just a point inside it (Moab -> Kerak),
    // so use the identification's own score instead.
    const score = isRegion ? ident?.score?.time_total ?? null : best?.score ?? null;
    const res = ident?.resolutions?.[0];
    const [lon, lat] = (res?.lonlat ?? "").split(",").map(Number);

    // Simplified outline, if the dataset has one for this place
    let outline = null;
    const gjPath = path.join(geoDir, "geometry", `${a.id}.geojson`);
    if (fs.existsSync(gjPath)) {
      const gj = JSON.parse(fs.readFileSync(gjPath, "utf8"));
      const feats = gj.features ?? [gj];
      const f = feats.find((x) => /\.simplified$/.test(x.properties?.id ?? "")) ??
        feats.find((x) => x.properties?.role === "isobands") ??
        feats.find((x) => x.geometry && x.geometry.type !== "Point");
      if (f) {
        const gid = f.properties.id.split(".")[0];
        const meta = geometryMeta.get(gid);
        const fromOsm = meta?.format === "osm" || a.geometry_credit === "osm";
        outline = {
          type: f.geometry.type,
          coordinates: roundCoords(f.geometry.coordinates),
          kind: f.properties.role === "isobands" ? "confidence bands" : meta?.geometry ?? "outline",
          ...(fromOsm ? { osm: true, osmUrl: meta?.source_url } : {}),
        };
      }
    }
    places.push({
      id: p.id,
      name: a.friendly_id.replace(/ \d+$/, ""),
      type,
      mapRole,
      mentionedIn: verses.map(osisToReadable),
      mapOnly: Boolean(p.mapOnly),
      chapters: [...new Set(verses.map((v) => +v.split(".")[1]))].sort((x, y) => x - y),
      identification: stripTags(ident?.description),
      modernLocation: isRegion ? undefined : best?.name,
      lonlat: Number.isFinite(lon) ? [lon, lat] : null,
      confidence: { score, outOf: 1000, label: confidenceLabel(score ?? 0) },
      outline,
      source: source("openbible-geo", {
        item: `https://www.openbible.info/geo/ancient/${a.id}/${a.url_slug}`,
        ...(outline?.osm ? { alsoCredit: "OpenStreetMap (ODbL 1.0)" } : {}),
      }),
    });
  }
  return { places };
}

// ---------- 3. People: Theographic ----------
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  const keys = head.map((h) => h.replace(/^﻿/, ""));
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ""])));
}
function pullPeople() {
  const rows = parseCsv(fs.readFileSync(path.join(CACHE, "theographic/CSV/People.csv"), "utf8"));
  const byLookup = new Map(rows.map((r) => [r.personLookup, r]));
  const ourId = new Map(cfg.people.map((p) => [p.theographic, p.id]));
  const ref = (lookup) => {
    const r = byLookup.get(lookup);
    return { name: r?.name ?? lookup, ...(ourId.has(lookup) ? { id: ourId.get(lookup) } : {}) };
  };
  const list = (s) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean).map(ref) : []);
  const people = [];
  for (const p of cfg.people) {
    const r = byLookup.get(p.theographic);
    if (!r) { gap("people", `Theographic has no record "${p.theographic}" for ${p.id}.`); continue; }
    const verses = r.verses.split(",").filter((v) => v.startsWith(cfg.osis + "."));
    people.push({
      id: p.id,
      name: r.name,
      displayTitle: r.displayTitle && r.displayTitle !== r.name ? r.displayTitle : undefined,
      alsoCalled: r.alsoCalled || undefined,
      gender: r.gender || undefined,
      family: {
        father: r.father ? ref(r.father) : undefined,
        mother: r.mother ? ref(r.mother) : undefined,
        spouses: list(r.partners),
        children: list(r.children),
        siblings: list(r.siblings),
      },
      chapters: [...new Set(verses.map((v) => +v.split(".")[1]))].sort((a, b) => a - b),
      verses: verses.map(osisToReadable),
      source: source("theographic", { item: r.personLookup, recordStatus: r.status || undefined }),
    });
  }
  return { license: "CC BY-SA 4.0", people };
}

// ---------- 4. Words: STEPBible ----------
/** Every tagged word in the Hebrew OT (TAHOT) or the Greek NT (TAGNT). */
function readTagged() {
  const dir = path.join(CACHE, "stepbible/Translators Amalgamated OT+NT");
  const words = []; // { book, chapter, verse, strongs: [...], original, translit, gloss }
  for (const f of fs.readdirSync(dir).filter((f) => f.startsWith(GREEK ? "TAGNT" : "TAHOT"))) {
    for (const line of fs.readFileSync(path.join(dir, f), "utf8").split("\n")) {
      const m = line.match(/^([1-3]?[A-Z][a-z]{1,2})\.(\d+)\.(\d+)(?:\([^)]*\))?#\d+=/);
      if (!m) continue;
      const cols = line.split("\t");
      if (GREEK) {
        // cols: ref, "Βίβλος (Biblos)", English, "G0976=N-NSF", "βίβλος=book", ...
        const strongs = [...(cols[3] ?? "").matchAll(/(G\d+[A-Za-z]?)=/g)].map((x) => x[1]);
        const [, original = cols[1], translit = ""] = (cols[1] ?? "").match(/^(.*?) \((.*)\)$/) ?? [];
        // TAGNT keeps punctuation and paragraph marks on the word; strip them.
        const clean = (x) => x.replace(/[.,;:·\u0387¶!?"“”‘’()\[\]]/g, "").trim();
        words.push({ book: m[1], chapter: +m[2], verse: +m[3], strongs, original: clean(original), translit: clean(translit), gloss: (cols[4] ?? "").split("=")[1] ?? "" });
      } else {
        const strongs = [...(cols[4] ?? "").matchAll(/\{(H\d+[A-Za-z]?)\}/g)].map((x) => x[1]);
        words.push({ book: m[1], chapter: +m[2], verse: +m[3], strongs, original: cols[1], translit: cols[2], gloss: cols[3] });
      }
    }
  }
  return words;
}
/** Plain text from a lexicon entry; long Greek entries are cut to their opening. */
function cleanMeaning(html) {
  let t = (html ?? "")
    .replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/__/g, "")
    .replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{2,}/g, "\n").trim();
  if (t.length > 600) {
    const cut = t.lastIndexOf("\n", 600);
    t = t.slice(0, cut > 200 ? cut : 600).trim() + " …";
  }
  return t;
}
function readLexicon() {
  const prefix = GREEK ? "TBESG" : "TBESH";
  const file = fs.readdirSync(path.join(CACHE, "stepbible/Lexicons")).find((f) => f.startsWith(prefix));
  const lex = new Map();
  for (const line of fs.readFileSync(path.join(CACHE, "stepbible/Lexicons", file), "utf8").split("\n")) {
    const c = line.split("\t");
    if (!/^[HG]\d/.test(c[0] ?? "") || !c[1]) continue;
    const key = c[1].split(" ")[0];
    lex.set(key, {
      strongs: key, original: c[3], transliteration: c[4], partOfSpeech: c[5], gloss: c[6],
      meaning: cleanMeaning(c[7]),
    });
  }
  return lex;
}
function pullWords() {
  const tahot = readTagged();
  const lex = readLexicon();
  const handWritten = JSON.parse(fs.readFileSync(path.join(BOOK_DIR, "words.json"), "utf8"));
  const out = [];
  for (const w of cfg.words) {
    const match = (t) => t.strongs.some((s) => w.strongs.includes(s) || w.strongs.includes(s.replace(/[a-z]$/, "")));
    const hits = tahot.filter(match);
    const inBook = hits.filter((t) => t.book === cfg.stepBook);
    if (!inBook.length) gap("words", `No ${w.strongs.join("/")} found in ${bookName} for "${w.id}".`);
    const verseKey = (t) => `${t.book}.${t.chapter}.${t.verse}`;
    const bookVerses = [...new Set(inBook.map(verseKey))].map((k) => {
      const [, c, v] = k.split(".");
      return `${bookName} ${c}:${v}`;
    });
    const allVerses = new Set(hits.map(verseKey));
    const forms = [...new Set(inBook.map((t) => `${t.original.replace(/[\\/]/g, "")}|${t.translit}|${t.gloss}`))]
      .slice(0, 6)
      .map((s) => { const [original, translit, gloss] = s.split("|"); return { original, translit, gloss }; });
    const entries = [...new Set(w.strongs.map((s) => s))].map((s) => lex.get(s)).filter(Boolean);
    if (entries.length < w.strongs.length) gap("words", `Lexicon entry missing for some of ${w.strongs.join(", ")} ("${w.id}").`);

    // Check our hand-picked "elsewhere" references actually contain this word
    const hw = handWritten.find((x) => x.id === w.id);
    const elsewhereCheck = (hw?.elsewhere ?? []).map((e) => {
      const p = parseReadable(e.ref);
      const code = p && NAME_TO_STEP[p.book];
      // Only check references in the testament we have tagging for.
      const isNT = Object.keys(STEP).indexOf(code) >= Object.keys(STEP).indexOf("Mat");
      if (!code || isNT !== GREEK) return { ref: e.ref, found: null };
      const at = (t) => t.book === code && t.chapter === p.chapter && (!p.verses || p.verses.includes(t.verse));
      const found = hits.some(at);
      if (!found) {
        const bases = w.strongs.map((s) => s.replace(/[A-Za-z]$/, ""));
        const variant = tahot.find((t) => at(t) && t.strongs.some((s) => bases.includes(s.replace(/[A-Za-z]$/, ""))));
        gap("words", variant
          ? `"${e.ref}" (listed under ${w.id}): STEPBible tags the same word there as ${variant.strongs.find((s) => bases.includes(s.replace(/[A-Za-z]$/, "")))}, a different sense ("${variant.gloss}"). Fine to keep if the note says so.`
          : `"${e.ref}" (listed under ${w.id}): STEPBible doesn't tag ${w.strongs.join("/")} there. It's a related word at most; the note should say so or the reference should go.`);
      }
      return { ref: e.ref, found };
    });

    out.push({
      id: w.id,
      strongs: w.strongs,
      lexicon: entries,
      formsInBook: forms,
      occurrencesInBook: bookVerses,
      language: GREEK ? "Greek" : "Hebrew",
      corpus: GREEK ? "New Testament" : "Hebrew Bible",
      corpusCount: allVerses.size,
      elsewhereCheck,
      source: source("stepbible", { item: w.strongs.join(", ") }),
    });
  }
  return { words: out };
}

// ---------- 5. Cross-references: OpenBible ----------
function pullCrossRefs() {
  const text = fs.readFileSync(path.join(CACHE, "openbible-xref/sources/extras/cross_references.txt"), "utf8");
  const header = text.slice(0, text.indexOf("\n"));
  const rows = [];
  for (const line of text.split("\n").slice(1)) {
    if (!line.startsWith(cfg.osis + ".")) continue;
    const [from, to, votes] = line.split("\t");
    rows.push({ from, to, votes: +votes });
  }
  const handFiles = fs.readdirSync(path.join(BOOK_DIR, "chapters"));
  const chapters = [];
  for (let n = 1; n <= JSON.parse(fs.readFileSync(path.join(BOOK_DIR, "book.json"), "utf8")).chapterCount; n++) {
    const inCh = rows.filter((r) => r.from.split(".")[1] === String(n));
    const external = inCh.filter((r) => !r.to.startsWith(cfg.osis + "."));
    const byTarget = new Map();
    for (const r of external) {
      const cur = byTarget.get(r.to);
      if (!cur) byTarget.set(r.to, { to: r.to, votes: r.votes, from: [r.from] });
      else { cur.votes += r.votes; cur.from.push(r.from); }
    }
    const suggested = [...byTarget.values()]
      .filter((x) => x.votes >= cfg.crossRefs.minVotes)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, cfg.crossRefs.perChapter)
      .map((x) => ({
        ref: osisToReadable(x.to),
        from: x.from.map(osisToReadable),
        votes: x.votes,
        source: source("openbible-xref", { item: `${x.from.join(", ")} → ${x.to}` }),
      }));

    // How do our hand-picked references compare with the dataset?
    const file = `${n}.json`;
    const hand = handFiles.includes(file) ? JSON.parse(fs.readFileSync(path.join(BOOK_DIR, "chapters", file), "utf8")).crossRefs ?? [] : [];
    const handCheck = hand.map((h) => {
      const p = parseReadable(h.ref);
      const hits = inCh.filter((r) => {
        const [a, b] = r.to.split("-");
        const [bk, c, v] = a.split(".");
        if (OSIS[bk] !== p?.book || +c !== p.chapter) return false;
        if (!p.verses) return true;
        const end = b ? +b.split(".")[2] : +v;
        return p.verses.some((x) => x >= +v && x <= end);
      });
      const votes = hits.reduce((s, r) => s + r.votes, 0);
      if (!hits.length) gap("cross-references", `${bookName} ${n}: our "${h.ref}" isn't linked from this chapter in OpenBible's data. Keep it only if we can justify it.`);
      return { ref: h.ref, inDataset: hits.length > 0, votes };
    });
    chapters.push({ number: n, suggested, handPickedCheck: handCheck });
  }
  return { datasetVersion: header.replace(/^.*#/, "").trim(), chapters };
}

// ---------- Write ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
const write = (name, data, sources, license) => {
  const body = {
    _about: `Generated by scripts/pull-sources.mjs on ${FETCHED}. Do not edit by hand; edit the hand-written files or the script.`,
    _sources: sources,
    ...(license ? { _license: license } : {}),
    ...data,
  };
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(body, null, 2) + "\n");
  console.log("wrote", path.relative(ROOT, path.join(OUT_DIR, name)));
};

write("text.json", pullText(), ["web"]);
write("places.json", pullPlaces(), ["openbible-geo", "osm"], "CC BY 4.0 (OpenBible.info); outlines marked osm: ODbL 1.0 (OpenStreetMap)");
write("people.json", pullPeople(), ["theographic"], "CC BY-SA 4.0. Derived from Theographic Bible Metadata; share-alike applies to this file.");
write("words.json", pullWords(), ["stepbible"], "CC BY 4.0 (STEPBible.org, Tyndale House Cambridge)");
write("crossrefs.json", pullCrossRefs(), ["openbible-xref"], "CC BY (OpenBible.info)");

// Gaps that apply to every book, plus any the book's config lists
gap("interpretation", "Authorship, dating, audience, historical setting, cultural notes, map stops, the timeline, and chapter summaries come from no dataset. They're marked needs-review.");
gap("words", "Range of meaning, English renderings, pronunciations, and notes are hand-written and need review. The STEPBible lexicon entry is shown alongside them.");
gap("people", "Theographic's descriptions are Easton's Bible Dictionary (1897) and its dates are debated; neither is displayed.");
gap("text", "The HelloAO Free Use Bible API and openbible.info aren't reachable from the build environment, so the WEB text and the cross-reference file come from GitHub mirrors (see the Sources page).");
for (const g of cfg.knownGaps ?? []) gap(g.area, g.text);

fs.writeFileSync(path.join(OUT_DIR, "gaps.json"), JSON.stringify({ _about: "Gaps and problems found while pulling data.", gaps }, null, 2) + "\n");
console.log(`\n${gaps.length} gaps written to ${path.relative(ROOT, path.join(OUT_DIR, "gaps.json"))}:`);
for (const g of gaps) console.log(` - [${g.area}] ${g.text}`);
