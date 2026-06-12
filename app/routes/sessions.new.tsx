import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { AppShell } from "~/modules/sessions/src/components/AppShell";
import { createSession } from "~/modules/sessions/src/hooks/use-sessions";
import { useConfigurables } from "~/modules/configurables";
import type { InterviewerRole } from "~/modules/sessions/src/types/session.types";

const ROLES: InterviewerRole[] = ["recruiter", "hiring_manager", "panel_interviewer", "technical"];
const ROLE_LABELS: Record<InterviewerRole, string> = {
  recruiter: "Recruiter",
  hiring_manager: "Hiring Manager",
  panel_interviewer: "Panel Interviewer",
  technical: "Technical Interviewer",
};

interface ReviewerEntry {
  id: string;
  name: string;
  role: InterviewerRole;
}

let reviewerCounter = 1;

export default function NewSessionPage() {
  const { config } = useConfigurables();
  const navigate = useNavigate();
  const accent = config?.brandColor?.accent ?? "#10B981";
  const secondary = config?.brandColor?.secondary ?? "#0EA5E9";

  const [form, setForm] = useState({
    candidateName: "",
    candidateEmail: "",
    role: "",
    round: "Round 1",
    scheduledAt: new Date().toISOString().slice(0, 16),
    status: "pending" as const,
    notes: "",
  });

  const [reviewers, setReviewers] = useState<ReviewerEntry[]>([
    { id: `r${reviewerCounter++}`, name: "", role: "hiring_manager" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addReviewer() {
    setReviewers((prev) => [
      ...prev,
      { id: `r${reviewerCounter++}`, name: "", role: "panel_interviewer" },
    ]);
  }

  function removeReviewer(id: string) {
    setReviewers((prev) => prev.filter((r) => r.id !== id));
  }

  function updateReviewer(id: string, field: keyof ReviewerEntry, value: string) {
    setReviewers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.candidateName.trim() || !form.role.trim()) {
      setError("Candidate name and role are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const res = await createSession({
      ...form,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      assignedReviewers: reviewers
        .filter((r) => r.name.trim())
        .map((r) => ({ ...r, feedbackSubmitted: false })),
    });

    setSaving(false);
    if (res.success && res.data) {
      navigate(`/sessions/${(res.data as any)._id}`);
    } else {
      setError(res.message ?? "Failed to create session.");
    }
  }

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/sessions" className="text-gray-500 hover:text-gray-300 text-sm">
            &larr; Sessions
          </Link>
          <h1 className="text-2xl font-bold text-white">New Interview Session</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Candidate */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Candidate</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  className={inputClass}
                  placeholder="Jane Doe"
                  value={form.candidateName}
                  onChange={(e) => setForm((f) => ({ ...f, candidateName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  className={inputClass}
                  type="email"
                  placeholder="jane@example.com"
                  value={form.candidateEmail}
                  onChange={(e) => setForm((f) => ({ ...f, candidateEmail: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Session Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Role *</label>
                <input
                  className={inputClass}
                  placeholder="Senior Frontend Engineer"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Round</label>
                <input
                  className={inputClass}
                  placeholder="Round 1"
                  value={form.round}
                  onChange={(e) => setForm((f) => ({ ...f, round: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Scheduled At</label>
                <input
                  className={inputClass}
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                className={`${inputClass} resize-none h-20`}
                placeholder="Any context for reviewers..."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>

          {/* Reviewers */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Assigned Reviewers</h2>
              <button
                type="button"
                onClick={addReviewer}
                className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
              >
                + Add Reviewer
              </button>
            </div>
            <div className="space-y-3">
              {reviewers.map((r) => (
                <div key={r.id} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className={labelClass}>Name</label>
                    <input
                      className={inputClass}
                      placeholder="Reviewer name"
                      value={r.name}
                      onChange={(e) => updateReviewer(r.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Role</label>
                    <select
                      className={inputClass}
                      value={r.role}
                      onChange={(e) => updateReviewer(r.id, "role", e.target.value)}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                      ))}
                    </select>
                  </div>
                  {reviewers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReviewer(r.id)}
                      className="pb-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Link
              to="/sessions"
              className="px-5 py-2 rounded text-sm border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded text-sm font-semibold text-white disabled:opacity-50 transition-colors"
              style={{ backgroundColor: accent }}
            >
              {saving ? "Creating..." : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
