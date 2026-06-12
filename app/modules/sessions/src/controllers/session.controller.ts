import type { Request, Response } from "express";
import { SessionService } from "../services/session.service";

export async function getAllSessions(req: Request, res: Response) {
  try {
    const { status, role } = req.query as { status?: string; role?: string };
    const sessions = await SessionService.getAllSessions({ status, role });
    return res.json({ success: true, data: sessions });
  } catch (error) {
    console.error("getAllSessions error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch sessions" });
  }
}

export async function getSessionById(req: Request, res: Response) {
  try {
    const session = await SessionService.getSessionById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    return res.json({ success: true, data: session });
  } catch (error) {
    console.error("getSessionById error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch session" });
  }
}

export async function createSession(req: Request, res: Response) {
  try {
    const session = await SessionService.createSession(req.body);
    return res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error("createSession error:", error);
    return res.status(500).json({ success: false, message: "Failed to create session" });
  }
}

export async function updateSession(req: Request, res: Response) {
  try {
    const session = await SessionService.updateSession(req.params.id, req.body);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    return res.json({ success: true, data: session });
  } catch (error) {
    console.error("updateSession error:", error);
    return res.status(500).json({ success: false, message: "Failed to update session" });
  }
}

export async function deleteSession(req: Request, res: Response) {
  try {
    const session = await SessionService.deleteSession(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    return res.json({ success: true, message: "Session deleted" });
  } catch (error) {
    console.error("deleteSession error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete session" });
  }
}

export async function submitFeedback(req: Request, res: Response) {
  try {
    const session = await SessionService.submitFeedback(req.params.id, req.body);
    return res.json({ success: true, data: session });
  } catch (error: any) {
    console.error("submitFeedback error:", error);
    if (error.message === "Session not found") {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    return res.status(500).json({ success: false, message: "Failed to submit feedback" });
  }
}

export async function getSessionStats(_req: Request, res: Response) {
  try {
    const stats = await SessionService.getSessionStats();
    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error("getSessionStats error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
}
