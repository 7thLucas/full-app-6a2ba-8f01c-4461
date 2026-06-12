import { cn } from "~/lib/utils";
import type { SessionStatus } from "../types/session.types";

const STATUS_CONFIG: Record<SessionStatus, { label: string; classes: string }> = {
  pending:     { label: "Pending",     classes: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  in_progress: { label: "In Progress", classes: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  completed:   { label: "Completed",   classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled:   { label: "Cancelled",   classes: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export function StatusBadge({ status }: { status: SessionStatus | string }) {
  const cfg = STATUS_CONFIG[status as SessionStatus] ?? { label: status, classes: "bg-gray-500/20 text-gray-400" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", cfg.classes)}>
      {cfg.label}
    </span>
  );
}
