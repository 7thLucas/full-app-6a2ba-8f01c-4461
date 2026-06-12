import { Link } from "react-router";
import { AppShell } from "~/modules/sessions/src/components/AppShell";
import { StatusBadge } from "~/modules/sessions/src/components/StatusBadge";
import { useSessionStats, useSessions } from "~/modules/sessions/src/hooks/use-sessions";
import { useConfigurables } from "~/modules/configurables";

export default function DashboardPage() {
  const { config } = useConfigurables();
  const { stats, loading: statsLoading } = useSessionStats();
  const { sessions, loading: sessionsLoading } = useSessions();

  const secondary = config?.brandColor?.secondary ?? "#0EA5E9";
  const accent = config?.brandColor?.accent ?? "#10B981";

  const recentSessions = sessions.slice(0, 5);

  const STAT_CARDS = [
    { label: "Total Sessions", value: stats.total, color: secondary },
    { label: "Pending Review", value: stats.pending, color: "#F59E0B" },
    { label: "In Progress", value: stats.inProgress, color: secondary },
    { label: "Completed", value: stats.completed, color: accent },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Track interview sessions and panel feedback at a glance.</p>
          </div>
          <Link
            to="/sessions/new"
            className="px-4 py-2 rounded text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: accent }}
          >
            + New Session
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CARDS.map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-3xl font-bold" style={{ color: stat.color }}>
                {statsLoading ? "—" : stat.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Sessions</h2>
            <Link to="/sessions" className="text-sm hover:underline" style={{ color: secondary }}>
              View all
            </Link>
          </div>

          {sessionsLoading ? (
            <div className="text-gray-500 text-sm py-8 text-center">Loading sessions...</div>
          ) : recentSessions.length === 0 ? (
            <div className="text-gray-500 text-sm py-12 text-center border border-dashed border-gray-800 rounded-xl">
              No sessions yet.{" "}
              <Link to="/sessions/new" className="hover:underline" style={{ color: accent }}>
                Create one
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}`}
                  className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white truncate">{session.candidateName}</span>
                        <StatusBadge status={session.status} />
                      </div>
                      <div className="text-sm text-gray-400 mt-0.5">
                        {session.role} · {session.round}
                      </div>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className="text-sm text-gray-400">
                        {new Date(session.scheduledAt).toLocaleDateString()}
                      </div>
                      {session.overallScore != null && (
                        <div className="text-sm font-semibold" style={{ color: accent }}>
                          {session.overallScore}/5
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Feedback completion */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {session.assignedReviewers.map((r) => (
                      <span
                        key={r.id}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          r.feedbackSubmitted
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {r.name.split(" ")[0]}: {r.feedbackSubmitted ? "Done" : "Pending"}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
