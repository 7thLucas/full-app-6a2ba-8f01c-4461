import { useConfigurables } from "~/modules/configurables";

export function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  const { config } = useConfigurables();
  const accent = config?.brandColor?.accent ?? "#10B981";
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{value}/{max}</span>
    </div>
  );
}
