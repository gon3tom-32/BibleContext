import type { MapData } from "@/lib/content";

type Props = {
  map: MapData;
  selected?: number;
  onSelect?: (order: number) => void;
  compact?: boolean;
};

const ROUTE_COLOR = { out: "var(--green)", back: "var(--gold-text)" } as const;

// Schematic, hand-drawn style map. All shapes come from the book's map.json.
export default function JourneyMap({ map, selected, onSelect, compact }: Props) {
  return (
    <svg viewBox={map.viewBox} role="img" aria-label={map.label} className="map-svg">
      {map.water.map((w) => (
        <g key={w.label}>
          <path d={w.d} fill="var(--map-water)" stroke="var(--map-water-edge)" strokeWidth={1.5} />
          <text x={w.labelX} y={w.labelY} fontSize={13} fill="var(--map-water-text)" textAnchor="middle">{w.label}</text>
        </g>
      ))}
      {map.rivers.map((r) => (
        <g key={r.label}>
          <path d={r.d} stroke="var(--map-water-edge)" strokeWidth={2.5} fill="none" />
          <text x={r.labelX} y={r.labelY} fontSize={12} fill="var(--map-water-text)">{r.label}</text>
        </g>
      ))}
      {map.routes.map((r) => (
        <path key={r.direction} d={r.d} fill="none" stroke={ROUTE_COLOR[r.direction]} strokeWidth={3} strokeDasharray="7 6" />
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
            {isSel && <circle cx={s.x} cy={s.y} r={21} fill="none" stroke="var(--gold-ring)" strokeWidth={3} />}
            <circle cx={s.x} cy={s.y} r={16} fill="var(--ink)" />
            <text x={s.x} y={s.y + 6} fontSize={15} fontWeight={600} fill="#fff" textAnchor="middle">{s.order}</text>
            {!compact && (
              <text x={s.labelX} y={s.labelY} fontSize={14} fontWeight={600} fill="var(--ink)" textAnchor={s.labelAnchor}>
                {s.short}
              </text>
            )}
          </g>
        );
      })}
      <text x={40} y={410} fontSize={12} fill="var(--text-2)">Schematic route, not to scale</text>
    </svg>
  );
}
