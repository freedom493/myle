interface ProgressProps {
  value: number;
  label?: string;
}

export function Progress({ value, label }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      {label ? <div className="text-sm font-medium text-brand-indigo">{label}</div> : null}
      <div className="overflow-hidden rounded-full bg-brand-indigo/10">
        <div
          className="h-3 rounded-full bg-brand-lime transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs font-medium text-brand-muted">{percent}% complete</div>
    </div>
  );
}
