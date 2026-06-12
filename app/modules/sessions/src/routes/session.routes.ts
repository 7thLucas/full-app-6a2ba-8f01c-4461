import { Router } from "express";
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  submitFeedback,
  getSessionStats,
} from "../controllers/session.controller";

const router = Router();

router.get("/sessions/stats", getSessionStats);
router.get("/sessions", getAllSessions);
router.get("/sessions/:id", getSessionById);
router.post("/sessions", createSession);
router.put("/sessions/:id", updateSession);
router.delete("/sessions/:id", deleteSession);
router.post("/sessions/:id/feedback", submitFeedback);

export default router;
