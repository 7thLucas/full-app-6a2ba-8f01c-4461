export type SessionStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type InterviewerRole = "recruiter" | "hiring_manager" | "panel_interviewer" | "technical";

export interface ScoreRubric {
  communication: number; // 1-5
  technicalFit: number;  // 1-5
  cultureFit: number;    // 1-5
  roleSpecific: number;  // 1-5
}

export interface PanelFeedback {
  reviewerId: string;
  reviewerName: string;
  reviewerRole: InterviewerRole;
  scores: ScoreRubric;
  notes: string;
  recommendation: "strong_yes" | "yes" | "neutral" | "no" | "strong_no";
  submittedAt: string;
}

export interface InterviewSession {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  round: string;
  scheduledAt: string;
  status: SessionStatus;
  assignedReviewers: Array<{
    id: string;
    name: string;
    role: InterviewerRole;
    feedbackSubmitted: boolean;
  }>;
  feedback: PanelFeedback[];
  overallScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateSessionInput = Omit<InterviewSession, "_id" | "feedback" | "overallScore" | "createdAt" | "updatedAt">;
export type SubmitFeedbackInput = Omit<PanelFeedback, "submittedAt">;
