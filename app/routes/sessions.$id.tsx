import { Link, useParams, useNavigate } from "react-router";
import { AppShell } from "~/modules/sessions/src/components/AppShell";
import { StatusBadge } from "~/modules/sessions/src/components/StatusBadge";
import { ScoreBar } from "~/modules/sessions/src/components/ScoreBar";
import { useSession, deleteSession } from "~/modules/sessions/src/hooks/use-sessions";
import { useConfigurables } from "~/modules/configurables";

const RECOMMENDATION_LABELS: Record<string, { label: string; color: string }> = {
  strong_yes: { label: "Strong Yes", color: "#10B981" },
  yes:        { label: "Yes",         color: "#34D399" },
  neutral:    { label: "Neutral",     color: "#9CA3AF" },
  no:         { label: "No",          color: "#F87171" },
  strong_no:  { label: "Strong No",   color: "#EF4444" },
};

const SCORE_LABELS = [
  { key: "communication", label: "Communication" },
  { key: "technicalFit",  label: "Technical Fit" },
  { key: "cultureFit",    label: "Culture Fit" },
  { key: "roleSpecific",  label: "Role-Specific" },
];

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { config } = useConfigurables();
  const navigate = useNavigate();
  const { session, loading, error } = useSession(id!);

  const secondary = config?.brandColor?.secondary ?? "#0EA5E9";
  const accent = config?.brandColor?.accent ?? "#10B981";
  const primary = config?.brandColor?.primary ?? "#1E3A5F";

  async function handleDelete() {
    if (!session) return;
    if (!confirm(`Delete session for ${session.candidateName}?`)) return;
    await deleteSession(session._id);
    navigate("/sessions");
  }

  if (loading) {
    return (
      <AppShell>
        <div className="text-gray-500 text-sm py-16 text-center">Loading session...</div>
      </AppShell>
    );
  }

  if (error || !session) {
    return (
      <AppShell>
        <div className="text-red-400 text-sm py-8 text-center">
          {error ?? "Session not found."}{" "}
          <Link to="/sessions" style={{ color: secondary }}>Back to sessions</Link>
        </div>
      </AppShell>
    );
  }

  const pendingReviewers = session.assignedReviewers.filter((r) => !r.feedbackSubmitted);
  const doneReviewers = session.assignedReviewers.filter((r) => r.feedbackSubmitted);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/sessions" className="hover:text-gray-300">Sessions</Link>
          <span>/</span>
          <span className="text-gray-300">{session.candidateName}</span>
        </div>

        {/* Session Header Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{session.candidateName}</h1>
                <StatusBadge status={session.status} />
              </div>
              <div className="text-gray-400 mt-1">{session.role} · {session.round}</div>
              {session.candidateEmail && (
                <div className="text-sm text-gray-500 mt-0.5">{session.candidateEmail}</div>
              )}
              <div className="text-sm text-gray-500 mt-1">
                Scheduled: {new Date(session.scheduledAt).toLocaleString()}
              </div>
            </div>
            {session.overallScore != null && (
              <div
                className="text-center rounded-xl px-5 py-3 border"
                style={{ borderColor: accent + "40", backgroundColor: accent + "10" }}
              >
                <div className="text-3xl font-bold" style={{ color: accent }}>
                  {session.overallScore}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">/ 5 avg</div>
              </div>
            )}
          </div>

          {session.notes && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</div>
              <p className="text-sm text-gray-300">{session.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex gap-3 flex-wrap">
            <Link
              to={`/sessions/${session._id}/feedback`}
              className="px-4 py-2 rounded text-sm font-semibold text-white"
              style={{ backgroundColor: secondary }}
            >
              Submit Feedback
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded text-sm border border-red-900/50 text-red-400 hover:border-red-700 transition-colors"
            >
              Delete Session
            </button>
          </div>
        </div>

        {/* Feedback Completion */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Reviewer Status ({doneReviewers.length}/{session.assignedReviewers.length} submitted)
          </h2>
          <div className="space-y-2">
            {session.assignedReviewers.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <span className="text-sm text-white">{r.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{r.role.replace("_", " ")}</span>
                </div>
                {r.feedbackSubmitted ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    Submitted
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel Feedback */}
        {session.feedback.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
            <div className="text-gray-500 text-sm">No feedback submitted yet.</div>
            <Link
              to={`/sessions/${session._id}/feedback`}
              className="mt-2 inline-block text-sm hover:underline"
              style={{ color: accent }}
            >
              Be the first to submit
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Panel Feedback ({session.feedback.length})
            </h2>
            {session.feedback.map((fb, idx) => {
              const rec = RECOMMENDATION_LABELS[fb.recommendation] ?? { label: fb.recommendation, color: "#9CA3AF" };
              return (
                <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-semibold text-white">{fb.reviewerName}</span>
                      <span className="text-xs text-gray-500 ml-2">{fb.reviewerRole.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: rec.color, backgroundColor: rec.color + "20" }}
                      >
                        {rec.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(fb.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SCORE_LABELS.map(({ key, label }) => (
                      <div key={key}>
                        <div className="text-xs text-gray-500 mb-1">{label}</div>
                        <ScoreBar value={(fb.scores as any)[key] ?? 0} />
                      </div>
                    ))}
                  </div>

                  {fb.notes && (
                    <div className="pt-3 border-t border-gray-800">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</div>
                      <p className="text-sm text-gray-300">{fb.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
