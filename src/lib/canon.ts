// The whole Bible, in canonical order. A book is "ready" when content/<slug>/ exists.
// To add a book, write its content folder using the same slug as here.

export type Testament = "OT" | "NT";

export type GroupId =
  | "law" | "ot-history" | "wisdom" | "major-prophets" | "minor-prophets"
  | "gospels" | "acts" | "paul" | "general" | "revelation";

export const GROUPS: { id: GroupId; label: string; testament: Testament; blurb: string }[] = [
  { id: "law", label: "Law", testament: "OT", blurb: "The first five books: creation, the patriarchs, the exodus, and the law." },
  { id: "ot-history", label: "History", testament: "OT", blurb: "Israel in the land, from Joshua to the return from exile." },
  { id: "wisdom", label: "Wisdom & poetry", testament: "OT", blurb: "Songs, sayings, and hard questions." },
  { id: "major-prophets", label: "Major prophets", testament: "OT", blurb: "The longer prophetic books." },
  { id: "minor-prophets", label: "Minor prophets", testament: "OT", blurb: "Twelve shorter prophetic books." },
  { id: "gospels", label: "Gospels", testament: "NT", blurb: "Four accounts of the life, death, and resurrection of Jesus." },
  { id: "acts", label: "Acts", testament: "NT", blurb: "The early church spreads from Jerusalem to Rome." },
  { id: "paul", label: "Paul's letters", testament: "NT", blurb: "Letters to churches and co-workers." },
  { id: "general", label: "General letters", testament: "NT", blurb: "Hebrews and the letters from other leaders." },
  { id: "revelation", label: "Revelation", testament: "NT", blurb: "A vision for churches under pressure." },
];

export type CanonBook = { slug: string; title: string; testament: Testament; group: GroupId; chapters: number };

const b = (slug: string, title: string, testament: Testament, group: GroupId, chapters: number): CanonBook => ({
  slug, title, testament, group, chapters,
});

export const CANON: CanonBook[] = [
  b("genesis", "Genesis", "OT", "law", 50),
  b("exodus", "Exodus", "OT", "law", 40),
  b("leviticus", "Leviticus", "OT", "law", 27),
  b("numbers", "Numbers", "OT", "law", 36),
  b("deuteronomy", "Deuteronomy", "OT", "law", 34),
  b("joshua", "Joshua", "OT", "ot-history", 24),
  b("judges", "Judges", "OT", "ot-history", 21),
  b("ruth", "Ruth", "OT", "ot-history", 4),
  b("1-samuel", "1 Samuel", "OT", "ot-history", 31),
  b("2-samuel", "2 Samuel", "OT", "ot-history", 24),
  b("1-kings", "1 Kings", "OT", "ot-history", 22),
  b("2-kings", "2 Kings", "OT", "ot-history", 25),
  b("1-chronicles", "1 Chronicles", "OT", "ot-history", 29),
  b("2-chronicles", "2 Chronicles", "OT", "ot-history", 36),
  b("ezra", "Ezra", "OT", "ot-history", 10),
  b("nehemiah", "Nehemiah", "OT", "ot-history", 13),
  b("esther", "Esther", "OT", "ot-history", 10),
  b("job", "Job", "OT", "wisdom", 42),
  b("psalms", "Psalms", "OT", "wisdom", 150),
  b("proverbs", "Proverbs", "OT", "wisdom", 31),
  b("ecclesiastes", "Ecclesiastes", "OT", "wisdom", 12),
  b("song-of-songs", "Song of Songs", "OT", "wisdom", 8),
  b("isaiah", "Isaiah", "OT", "major-prophets", 66),
  b("jeremiah", "Jeremiah", "OT", "major-prophets", 52),
  b("lamentations", "Lamentations", "OT", "major-prophets", 5),
  b("ezekiel", "Ezekiel", "OT", "major-prophets", 48),
  b("daniel", "Daniel", "OT", "major-prophets", 12),
  b("hosea", "Hosea", "OT", "minor-prophets", 14),
  b("joel", "Joel", "OT", "minor-prophets", 3),
  b("amos", "Amos", "OT", "minor-prophets", 9),
  b("obadiah", "Obadiah", "OT", "minor-prophets", 1),
  b("jonah", "Jonah", "OT", "minor-prophets", 4),
  b("micah", "Micah", "OT", "minor-prophets", 7),
  b("nahum", "Nahum", "OT", "minor-prophets", 3),
  b("habakkuk", "Habakkuk", "OT", "minor-prophets", 3),
  b("zephaniah", "Zephaniah", "OT", "minor-prophets", 3),
  b("haggai", "Haggai", "OT", "minor-prophets", 2),
  b("zechariah", "Zechariah", "OT", "minor-prophets", 14),
  b("malachi", "Malachi", "OT", "minor-prophets", 4),
  b("matthew", "Matthew", "NT", "gospels", 28),
  b("mark", "Mark", "NT", "gospels", 16),
  b("luke", "Luke", "NT", "gospels", 24),
  b("john", "John", "NT", "gospels", 21),
  b("acts", "Acts", "NT", "acts", 28),
  b("romans", "Romans", "NT", "paul", 16),
  b("1-corinthians", "1 Corinthians", "NT", "paul", 16),
  b("2-corinthians", "2 Corinthians", "NT", "paul", 13),
  b("galatians", "Galatians", "NT", "paul", 6),
  b("ephesians", "Ephesians", "NT", "paul", 6),
  b("philippians", "Philippians", "NT", "paul", 4),
  b("colossians", "Colossians", "NT", "paul", 4),
  b("1-thessalonians", "1 Thessalonians", "NT", "paul", 5),
  b("2-thessalonians", "2 Thessalonians", "NT", "paul", 3),
  b("1-timothy", "1 Timothy", "NT", "paul", 6),
  b("2-timothy", "2 Timothy", "NT", "paul", 4),
  b("titus", "Titus", "NT", "paul", 3),
  b("philemon", "Philemon", "NT", "paul", 1),
  b("hebrews", "Hebrews", "NT", "general", 13),
  b("james", "James", "NT", "general", 5),
  b("1-peter", "1 Peter", "NT", "general", 5),
  b("2-peter", "2 Peter", "NT", "general", 3),
  b("1-john", "1 John", "NT", "general", 5),
  b("2-john", "2 John", "NT", "general", 1),
  b("3-john", "3 John", "NT", "general", 1),
  b("jude", "Jude", "NT", "general", 1),
  b("revelation", "Revelation", "NT", "revelation", 22),
];
