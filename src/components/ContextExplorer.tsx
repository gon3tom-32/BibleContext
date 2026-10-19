"use client";

import Link from "next/link";
import { useState } from "react";
import type { MapData } from "@/lib/content";
import JourneyMap from "./JourneyMap";

export default function ContextExplorer({ map, slug }: { map: MapData; slug: string }) {
  const [selected, setSelected] = useState(map.stops[0]?.order ?? 1);
  const stop = map.stops.find((s) => s.order === selected) ?? map.stops[0];

  return (
    <section className="map-wrap" aria-labelledby="journey-heading">
      <div className="card map-card">
        <h2 id="journey-heading">{map.title}</h2>
        <JourneyMap map={map} selected={selected} onSelect={setSelected} />
        <ul className="legend">
          {map.routes.map((r) => (
            <li key={r.direction}>
              <span className="legend-line" style={{ borderColor: r.direction === "out" ? "var(--green)" : "var(--gold-text)" }} />
              {r.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="stops">
        <div className="label" id="stops-label">Stops</div>
        {map.stops.map((s) => (
          <button
            key={s.order}
            type="button"
            className="stop-btn"
            aria-pressed={s.order === selected}
            aria-controls="stop-detail"
            onClick={() => setSelected(s.order)}
          >
            <span className="stop-num" aria-hidden="true">{s.order}</span>
            {s.title}
          </button>
        ))}

        {stop && (
          <div className="band stop-detail" id="stop-detail" aria-live="polite">
            <div className="eyebrow">Stop {stop.order} · {stop.refs}</div>
            <h3>{stop.title}</h3>
            <p>{stop.text}</p>
            <Link href={`/${slug}/${map.chapter}/`}>Read Chapter {map.chapter}</Link>
          </div>
        )}
      </div>
    </section>
  );
}
