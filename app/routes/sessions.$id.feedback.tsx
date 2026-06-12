import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AppShell } from "~/modules/sessions/src/components/AppShell";
import { RatingSlider } from "~/modules/sessions/src/components/RatingSlider";
import { useSession, submitFeedback } from "~/modules/sessions/src/hooks/use-sessions";
import { useConfigurables } from "~/modules/configurables";
import type { InterviewerRole } from "~/modules/sessions/src/types/session.types";

const ROLE_LABELS: Record<InterviewerRole, string> = {
  recruiter: "Recruiter",
  hiring_manager: "Hiring Manager",
  panel_interviewer: "Panel Interviewer",
  technical: "Technical Interviewer",
};

const RECOMMENDATIONS = [
  { value: "strong_yes", label: "Strong Yes" },
  { value: "yes",        label: "Yes" },
  { value: "neutral",    label: "Neutral" },
  { value: "no",         label: "No" },
  { value: "strong_no",  label: "Strong No" },
];

const REC_COLORS: Record<string, string> = {
  strong_yes: "#10B981",
  yes:        "#34D399",
  neutral:    "#9CA3AF",
  no:         "#F87171",
  strong_no:  "#EF4444",
};

export default function SubmitFeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const { config } = useConfigurables();
  const navigate = useNavigate();
  const { session, loading } = useSession(id!);

  const accent = config?.brandColor?.accent ?? "#10B981";
  const secondary = config?.brandColor?.secondary ?? "#0EA5E9";

  const [form, setForm] = useState({
    reviewerId: "",
    reviewerName: "",
    reviewerRole: "hiring_manager" as InterviewerRole,
    scores: { communication: 3, technicalFit: 3, cultureFit: 3, roleSpecific: 3 },
    notes: "",
    recommendation: "yes",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setScore(key: string, val: number) {
    setForm((f) => ({ ...f, scores: { ...f.scores, [key]: val } }));
  }

  // Pre-fill reviewer from session list
  function handleReviewerSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (!val) {
      setForm((f) => ({ ...f, reviewerId: "", reviewerName: "" }));
      return;
    }
    const reviewer = session?.assignedReviewers.find((r) => r.id === val);
    if (reviewer) {
      setForm((f) => ({
        ...f,
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        reviewerRole: reviewer.role as InterviewerRole,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.reviewerName.trim()) {
      setError("Reviewer name required.");
      return;
    }
    setSaving(true);
    setError(null);

    const res = await submitFeedback(id!, {
      ...form,
      reviewerId: form.reviewerId || `manual-${Date.now()}`,
    });

    setSaving(false);
    if (res.success) {
      navigate(`/sessions/${id}`);
    } else {
      setError(res.message ?? "Failed to submit feedback.");
    }
  }

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <AppShell>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/sessions" className="hover:text-gray-300">Sessions</Link>
          <span>/</span>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <Link to={`/sessions/${id}`} className="hover:text-gray-300">
              {session?.candidateName ?? id}
            </Link>
          )}
          <span>/</span>
          <span className="text-gray-300">Feedback</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Submit Feedback</h1>
          {session && (
            <p className="text-gray-400 text-sm mt-1">
              {session.candidateName} · {session.role} · {session.round}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Reviewer Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Reviewer</h2>

            {session && session.assignedReviewers.length > 0 && (
              <div>
                <label className={labelClass}>Select assigned reviewer (optional)</label>
                <select className={inputClass} onChange={handleReviewerSelect} defaultValue="">
                  <option value="">-- Enter manually --</option>
                  {session.assignedReviewers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.role.replace("_", " ")})
                      {r.feedbackSubmitted ? " — already submitted" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Your Name *</label>
                <input
                  className={inputClass}
                  placeholder="Sarah Kim"
                  value={form.reviewerName}
                  onChange={(e) => setForm((f) => ({ ...f, reviewerName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Your Role</label>
                <select
                  className={inputClass}
                  value={form.reviewerRole}
                  onChange={(e) => setForm((f) => ({ ...f, reviewerRole: e.target.value as InterviewerRole }))}
                >
                  {(Object.entries(ROLE_LABELS) as [InterviewerRole, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Rubric Scores (1–5)</h2>
            <RatingSlider label="Communication" name="communication" value={form.scores.communication} onChange={(v) => setScore("communication", v)} />
            <RatingSlider label="Technical Fit" name="technicalFit" value={form.scores.technicalFit} onChange={(v) => setScore("technicalFit", v)} />
            <RatingSlider label="Culture Fit" name="cultureFit" value={form.scores.cultureFit} onChange={(v) => setScore("cultureFit", v)} />
            <RatingSlider label="Role-Specific" name="roleSpecific" value={form.scores.roleSpecific} onChange={(v) => setScore("roleSpecific", v)} />
          </div>

          {/* Recommendation */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recommendation</h2>
            <div className="flex gap-2 flex-wrap">
              {RECOMMENDATIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, recommendation: r.value }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors`}
                  style={{
                    borderColor: form.recommendation === r.value ? REC_COLORS[r.value] : "#374151",
                    color: form.recommendation === r.value ? REC_COLORS[r.value] : "#9CA3AF",
                    backgroundColor: form.recommendation === r.value ? REC_COLORS[r.value] + "15" : "transparent",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <label className={labelClass}>Notes / Observations</label>
            <textarea
              className={`${inputClass} resize-none h-28`}
              placeholder="Share specific observations about the candidate's performance..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Link
              to={`/sessions/${id}`}
              className="px-5 py-2 rounded text-sm border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              {saving ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
