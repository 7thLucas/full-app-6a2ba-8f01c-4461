import { useConfigurables } from "~/modules/configurables";

interface RatingSliderProps {
  label: string;
  name: string;
  value: number;
  onChange: (val: number) => void;
}

export function RatingSlider({ label, name, value, onChange }: RatingSliderProps) {
  const { config } = useConfigurables();
  const accent = config?.brandColor?.accent ?? "#10B981";

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="text-sm text-gray-300">{label}</label>
        <span className="text-sm font-semibold" style={{ color: accent }}>{value}/5</span>
      </div>
      <input
        id={name}
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
        style={{ accentColor: accent }}
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
      </div>
    </div>
  );
}
