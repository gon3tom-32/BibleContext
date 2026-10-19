import type { MapData } from "@/lib/content";

type Props = {
  map: MapData;
  selected?: number;
  onSelect?: (order: number) => void;
  compact?: boolean;
};

export const ROUTE_COLOR = { out: "var(--green)", back: "var(--gold-text)", both: "var(--ink)" } as const;

// The journey map. Shapes come from the book's map data: either real
// coordinates (see buildRealMap in lib/content.ts) or a hand-drawn schematic.
export default function JourneyMap({ map, selected, onSelect, compact }: Props) {
  const [, , w, h] = map.viewBox.split(" ").map(Number);
  const real = map.real;
  return (
    <svg viewBox={map.viewBox} role="img" aria-label={map.label} className="map-svg">
      <defs>
        <clipPath id={`clip-${compact ? "c" : "f"}`}>
          <rect x={0} y={0} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${compact ? "c" : "f"})`}>
        {real?.regions.map((r) => (
          <g key={r.label}>
            {r.d.map((d, i) => (
              <path key={i} d={d} fill="var(--green)" fillOpacity={0.045} stroke="none" />
            ))}
          </g>
        ))}
        {map.water.map((wtr) => (
          <path key={wtr.label} d={wtr.d} fill="var(--map-water)" stroke="var(--map-water-edge)" strokeWidth={1.5} />
        ))}
        {map.rivers.map((r) => (
          <path key={r.label} d={r.d} stroke="var(--map-water-edge)" strokeWidth={2.5} fill="none" strokeLinejoin="round" />
        ))}
      </g>

      {/* Labels for water and regions */}
      {map.water.map((wtr) => (
        <text key={wtr.label} className="lbl-minor" x={wtr.labelX} y={wtr.labelY} fontSize={13} fill="var(--map-water-text)" textAnchor="middle">{wtr.label}</text>
      ))}
      {!compact && map.rivers.map((r) => (
        <text key={r.label} className="lbl-minor" x={r.labelX} y={r.labelY} fontSize={12} fill="var(--map-water-text)">{r.label}</text>
      ))}
      {compact && real?.regions.map((r) => (
        <text key={r.label} x={r.labelX + 40} y={r.labelY + 50} fontSize={compact ? 14 : 15} fontWeight={600} fill="var(--green)" letterSpacing="0.2em">
          {r.label.toUpperCase()}
        </text>
      ))}

      {map.routes.map((r) => (
        <path key={r.direction} d={r.d} fill="none" stroke={ROUTE_COLOR[r.direction]} strokeWidth={3} strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {real && !compact && real.towns.map((t) => (
        <g key={t.name} aria-hidden="true">
          <circle cx={t.x} cy={t.y} r={4} fill="var(--muted)" />
          <text className="lbl-minor" x={t.x - 8} y={t.y + 4} fontSize={12} fill="var(--text-2)" textAnchor={t.anchor}>{t.name}</text>
        </g>
      ))}

      {map.stops.map((s) => {
        const isSel = s.order === selected;
        return (
          <g
            key={s.order}
            className={onSelect ? "map-stop" : undefined}
            onClick={onSelect ? () => onSelect(s.order) : undefined}
            aria-hidden="true"
          >
            {isSel && <circle className="stop-ring" cx={s.x} cy={s.y} r={21} fill="none" stroke="var(--gold-ring)" strokeWidth={3} />}
            <circle className="stop-dot" cx={s.x} cy={s.y} r={16} fill="var(--ink)" />
            <text className="stop-num-text" x={s.x} y={s.y + 6} fontSize={15} fontWeight={600} fill="#fff" textAnchor="middle">{s.order}</text>
            {!compact && (
              <text className="lbl-stop" x={s.labelX} y={s.labelY} fontSize={14} fontWeight={600} fill="var(--ink)" textAnchor={s.labelAnchor} paintOrder="stroke" stroke="var(--map-land)" strokeWidth={4}>
                {s.short}
              </text>
            )}
          </g>
        );
      })}

      {real ? (
        <g aria-hidden="true" fontSize={12} fill="var(--text-2)">
          <rect x={real.scale.x} y={real.scale.y} width={real.scale.px} height={5} fill="var(--ink)" />
          <rect x={real.scale.x + real.scale.px / 2} y={real.scale.y} width={real.scale.px / 2} height={5} fill="var(--map-land)" stroke="var(--ink)" strokeWidth={1} />
          <text x={real.scale.x} y={real.scale.y - 6}>0</text>
          <text x={real.scale.x + real.scale.px} y={real.scale.y - 6} textAnchor="middle">{real.scale.km} km</text>
          <g transform={`translate(${w - 30} 34)`}>
            <path d="M0 -18 L7 4 L0 0 L-7 4 Z" fill="var(--ink)" />
            <text x={0} y={18} textAnchor="middle" fontWeight={600}>N</text>
          </g>
        </g>
      ) : (
        <text x={40} y={h - 10} fontSize={12} fill="var(--text-2)">{map.caption}</text>
      )}
    </svg>
  );
}
