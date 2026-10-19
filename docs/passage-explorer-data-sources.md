# Passage Explorer: data sources brief

Original brief for choosing data sources. What was actually done is in `docs/DATA.md`.

## Ground rules

- Inspect each source's files and license before relying on it.
- Record provenance: every pulled item gets a `source` field.
- Provide a Sources page crediting every dataset, with license names.
- Interpretation (authorship, dating, audience, history, culture) isn't in these datasets. Don't invent it or copy commentaries. Mark it `needs-review`.
- No secrets in the repo. API keys go in environment variables.
- Fetch at build time and cache in the repo; don't call APIs from the browser.

## Sources

- **Scripture text:** a public-domain translation (WEB or BSB) bundled in the repo. Copyrighted translations (API.Bible, ESV API) only as an optional private extra; both have non-commercial limits.
- **Places:** OpenBible.info Bible Geocoding Data (CC BY 4.0; some geometry from OpenStreetMap, ODbL 1.0).
- **People:** Theographic Bible Metadata (CC BY-SA 4.0). ACAI (CC BY-SA 4.0) only for gaps.
- **Words:** STEPBible Data (CC BY 4.0). Look up Strong's numbers in the data, not from memory.
- **Cross-references:** OpenBible.info (CC BY). Keep a short, relevant list.

## Before going public

If the site is shared beyond the two of us, or gains ads, subscriptions, or paid access, re-check each license and API's terms.
