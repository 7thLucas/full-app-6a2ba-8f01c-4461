import { SessionModel } from "../models/session.model";
import type { CreateSessionInput, SubmitFeedbackInput } from "../types/session.types";

export class SessionService {
  static async getAllSessions(filters?: { status?: string; role?: string }) {
    const query: Record<string, any> = { deletedAt: null };
    if (filters?.status) query.status = filters.status;
    if (filters?.role) query.role = filters.role;
    return SessionModel.find(query).sort({ scheduledAt: -1 }).lean().exec();
  }

  static async getSessionById(id: string) {
    return SessionModel.findOne({ _id: id, deletedAt: null }).lean().exec();
  }

  static async createSession(input: CreateSessionInput) {
    return SessionModel.create({
      ...input,
      feedback: [],
    });
  }

  static async updateSession(id: string, updates: Partial<CreateSessionInput>) {
    return SessionModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: updates },
      { new: true }
    ).lean().exec();
  }

  static async deleteSession(id: string) {
    return SessionModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    ).lean().exec();
  }

  static async submitFeedback(sessionId: string, feedback: SubmitFeedbackInput) {
    const session = await SessionModel.findOne({ _id: sessionId, deletedAt: null });
    if (!session) throw new Error("Session not found");

    const existingIdx = session.feedback.findIndex(
      (f) => f.reviewerId === feedback.reviewerId
    );

    const feedbackEntry = {
      ...feedback,
      submittedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      session.feedback[existingIdx] = feedbackEntry as any;
    } else {
      session.feedback.push(feedbackEntry as any);
    }

    // Mark reviewer as submitted
    const reviewerIdx = session.assignedReviewers.findIndex(
      (r) => r.id === feedback.reviewerId
    );
    if (reviewerIdx >= 0) {
      session.assignedReviewers[reviewerIdx].feedbackSubmitted = true;
    }

    // Recalculate overall score as average of all rubric scores
    if (session.feedback.length > 0) {
      let total = 0;
      let count = 0;
      for (const f of session.feedback) {
        const s = f.scores as any;
        total += (s.communication + s.technicalFit + s.cultureFit + s.roleSpecific) / 4;
        count++;
      }
      session.overallScore = Math.round((total / count) * 10) / 10;
    }

    return session.save();
  }

  static async getSessionStats() {
    const total = await SessionModel.countDocuments({ deletedAt: null });
    const pending = await SessionModel.countDocuments({ deletedAt: null, status: "pending" });
    const completed = await SessionModel.countDocuments({ deletedAt: null, status: "completed" });
    const inProgress = await SessionModel.countDocuments({ deletedAt: null, status: "in_progress" });
    return { total, pending, completed, inProgress };
  }
}
