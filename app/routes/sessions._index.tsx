import { useState } from "react";
import { Link } from "react-router";
import { AppShell } from "~/modules/sessions/src/components/AppShell";
import { StatusBadge } from "~/modules/sessions/src/components/StatusBadge";
import { useSessions, deleteSession } from "~/modules/sessions/src/hooks/use-sessions";
import { useConfigurables } from "~/modules/configurables";
import type { SessionStatus } from "~/modules/sessions/src/types/session.types";

const STATUSES: Array<{ value: string; label: string }> = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function SessionsPage() {
  const { config } = useConfigurables();
  const [statusFilter, setStatusFilter] = useState("");
  const { sessions, loading, error, refetch } = useSessions(
    statusFilter ? { status: statusFilter } : undefined
  );

  const secondary = config?.brandColor?.secondary ?? "#0EA5E9";
  const accent = config?.brandColor?.accent ?? "#10B981";

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete session for ${name}? This cannot be undone.`)) return;
    await deleteSession(id);
    refetch();
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Interview Sessions</h1>
            <p className="text-gray-400 text-sm mt-1">{sessions.length} session{sessions.length !== 1 ? "s" : ""} found</p>
          </div>
          <Link
            to="/sessions/new"
            className="px-4 py-2 rounded text-sm font-semibold text-white"
            style={{ backgroundColor: accent }}
          >
            + New Session
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === s.value
                  ? "text-white border-transparent"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
              style={statusFilter === s.value ? { backgroundColor: secondary, borderColor: secondary } : {}}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="text-gray-500 text-sm py-12 text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-400 text-sm py-8 text-center">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-500 text-sm py-16 text-center border border-dashed border-gray-800 rounded-xl">
            No sessions match this filter.{" "}
            <Link to="/sessions/new" style={{ color: accent }} className="hover:underline">
              Create one
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        to={`/sessions/${session._id}`}
                        className="font-semibold text-white hover:underline"
                        style={{ textDecorationColor: secondary }}
                      >
                        {session.candidateName}
                      </Link>
                      <StatusBadge status={session.status as SessionStatus} />
                      {session.overallScore != null && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-800" style={{ color: accent }}>
                          Score: {session.overallScore}/5
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {session.role} · {session.round} · {new Date(session.scheduledAt).toLocaleDateString()}
                    </div>
                    {/* Reviewer chips */}
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {session.assignedReviewers.map((r) => (
                        <span
                          key={r.id}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            r.feedbackSubmitted
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-gray-800 text-gray-500"
                          }`}
                        >
                          {r.name}: {r.feedbackSubmitted ? "Submitted" : "Pending"}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/sessions/${session._id}`}
                      className="px-3 py-1.5 text-xs rounded border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      to={`/sessions/${session._id}/feedback`}
                      className="px-3 py-1.5 text-xs rounded text-white font-medium transition-colors"
                      style={{ backgroundColor: secondary }}
                    >
                      Add Feedback
                    </Link>
                    <button
                      onClick={() => handleDelete(session._id, session.candidateName)}
                      className="px-3 py-1.5 text-xs rounded border border-red-900/50 text-red-400 hover:border-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
