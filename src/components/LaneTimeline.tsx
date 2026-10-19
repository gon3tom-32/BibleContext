import type { Timeline } from "@/lib/content";

// Lanes across eras. Deliberately in order, not to scale.
export default function LaneTimeline({ timeline }: { timeline: Timeline }) {
  const { eras, lanes, events, focusEraId } = timeline;
  return (
    <section className="card card--tight" aria-labelledby="timeline-heading" style={{ padding: 24, gap: 16 }}>
      <div className="card-head">
        <h2 id="timeline-heading">{timeline.title}</h2>
        <div className="smaller" style={{ color: "var(--muted)" }}>Shown in order, not to scale. Dates are debated.</div>
      </div>
      <div className="lanes-scroll" tabIndex={0} aria-label="Timeline, scrolls sideways on small screens">
        <div className="lanes" role="table" aria-label="Events by era" style={{ ["--eras" as string]: eras.length }}>
          <div role="row" style={{ display: "contents" }}>
            <div role="columnheader" aria-label="Lane" />
            {eras.map((e) => (
              <div key={e.id} role="columnheader" className={`lane-era${e.id === focusEraId ? " lane-era--focus" : ""}`}>
                {e.label}
              </div>
            ))}
          </div>
          {lanes.map((lane) => (
            <div key={lane.id} role="row" style={{ display: "contents" }}>
              <div role="rowheader" className="lane-label">{lane.label}</div>
              {eras.map((era) => {
                const ev = events.find((x) => x.lane === lane.id && x.eraId === era.id);
                if (!ev) return <div key={era.id} role="cell" />;
                const cls =
                  lane.id === "book" || ev.highlight
                    ? "lane-cell lane-cell--book"
                    : era.id === focusEraId
                      ? "lane-cell lane-cell--focus"
                      : "lane-cell";
                return (
                  <div key={era.id} role="cell" className={cls}>{ev.text}</div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
