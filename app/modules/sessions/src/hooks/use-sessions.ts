import { useState, useEffect, useCallback } from "react";
import { apiGet, apiRequest } from "~/lib/api.client";
import type { InterviewSession, CreateSessionInput, SubmitFeedbackInput } from "../types/session.types";

export function useSessions(filters?: { status?: string }) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiGet<InterviewSession[]>("/api/sessions", filters);
    if (res.success && res.data) {
      setSessions(res.data);
    } else {
      setError(res.message ?? "Failed to load sessions");
    }
    setLoading(false);
  }, [filters?.status]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  return { sessions, loading, error, refetch: fetchSessions };
}

export function useSession(id: string) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const res = await apiGet<InterviewSession>(`/api/sessions/${id}`);
    if (res.success && res.data) {
      setSession(res.data);
    } else {
      setError(res.message ?? "Failed to load session");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  return { session, loading, error, refetch: fetchSession };
}

export function useSessionStats() {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<typeof stats>("/api/sessions/stats").then((res) => {
      if (res.success && res.data) setStats(res.data);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
}

export async function createSession(input: CreateSessionInput) {
  return apiRequest<InterviewSession>("/api/sessions", { method: "POST", data: input });
}

export async function updateSession(id: string, input: Partial<CreateSessionInput>) {
  return apiRequest<InterviewSession>(`/api/sessions/${id}`, { method: "PUT", data: input });
}

export async function deleteSession(id: string) {
  return apiRequest(`/api/sessions/${id}`, { method: "DELETE" });
}

export async function submitFeedback(sessionId: string, feedback: SubmitFeedbackInput) {
  return apiRequest<InterviewSession>(`/api/sessions/${sessionId}/feedback`, {
    method: "POST",
    data: feedback,
  });
}
