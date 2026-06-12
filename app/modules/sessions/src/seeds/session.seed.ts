import { createLogger } from "~/lib/logger";
import { SessionModel } from "../models/session.model";

const logger = createLogger("SessionSeed");

const SAMPLE_SESSIONS = [
  {
    candidateName: "Alex Chen",
    candidateEmail: "alex.chen@email.com",
    role: "Senior Frontend Engineer",
    round: "Technical Round 1",
    scheduledAt: "2026-06-10T10:00:00.000Z",
    status: "completed",
    assignedReviewers: [
      { id: "r1", name: "Sarah Kim", role: "hiring_manager", feedbackSubmitted: true },
      { id: "r2", name: "Marcus Webb", role: "technical", feedbackSubmitted: true },
    ],
    feedback: [
      {
        reviewerId: "r1",
        reviewerName: "Sarah Kim",
        reviewerRole: "hiring_manager",
        scores: { communication: 4, technicalFit: 4, cultureFit: 5, roleSpecific: 4 },
        notes: "Strong communicator. Explained technical decisions clearly. Culture fit looks excellent.",
        recommendation: "yes",
        submittedAt: "2026-06-10T12:00:00.000Z",
      },
      {
        reviewerId: "r2",
        reviewerName: "Marcus Webb",
        reviewerRole: "technical",
        scores: { communication: 4, technicalFit: 5, cultureFit: 4, roleSpecific: 5 },
        notes: "Exceptional React knowledge. Solved the system design problem efficiently.",
        recommendation: "strong_yes",
        submittedAt: "2026-06-10T13:00:00.000Z",
      },
    ],
    overallScore: 4.4,
    notes: "Strong candidate — proceed to final round.",
  },
  {
    candidateName: "Jordan Rivera",
    candidateEmail: "jordan.r@email.com",
    role: "Product Manager",
    round: "Round 1 — Culture & PM Fit",
    scheduledAt: "2026-06-11T14:00:00.000Z",
    status: "in_progress",
    assignedReviewers: [
      { id: "r3", name: "Priya Nair", role: "recruiter", feedbackSubmitted: true },
      { id: "r4", name: "Tom Baxter", role: "hiring_manager", feedbackSubmitted: false },
    ],
    feedback: [
      {
        reviewerId: "r3",
        reviewerName: "Priya Nair",
        reviewerRole: "recruiter",
        scores: { communication: 5, technicalFit: 3, cultureFit: 5, roleSpecific: 4 },
        notes: "Very articulate. Has strong product instincts. Needs more technical grounding.",
        recommendation: "yes",
        submittedAt: "2026-06-11T15:30:00.000Z",
      },
    ],
    overallScore: 4.3,
    notes: "",
  },
  {
    candidateName: "Mia Thompson",
    candidateEmail: "mia.t@email.com",
    role: "Backend Engineer",
    round: "Round 2 — System Design",
    scheduledAt: "2026-06-12T09:00:00.000Z",
    status: "pending",
    assignedReviewers: [
      { id: "r5", name: "Dev Patel", role: "technical", feedbackSubmitted: false },
      { id: "r6", name: "Lisa Park", role: "hiring_manager", feedbackSubmitted: false },
    ],
    feedback: [],
    notes: "Promising candidate from round 1.",
  },
  {
    candidateName: "Omar Hassan",
    candidateEmail: "omar.h@email.com",
    role: "UX Designer",
    round: "Portfolio Review",
    scheduledAt: "2026-06-08T11:00:00.000Z",
    status: "cancelled",
    assignedReviewers: [
      { id: "r7", name: "Nina Cross", role: "hiring_manager", feedbackSubmitted: false },
    ],
    feedback: [],
    notes: "Candidate withdrew.",
  },
];

export async function seedSessions(): Promise<void> {
  try {
    const count = await SessionModel.countDocuments({ deletedAt: null });
    if (count > 0) {
      logger.info("Sessions already seeded, skipping");
      return;
    }

    logger.info("Seeding interview sessions...");
    await SessionModel.insertMany(SAMPLE_SESSIONS);
    logger.info("Sessions seeded successfully");
  } catch (error) {
    logger.error("Failed to seed sessions:", error);
  }
}
