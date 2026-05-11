import { Request, Response } from "express";

import { Log } from "../utils/logger";
import {
  createNotification,
  deleteNotification,
  listNotifications,
  markAsRead,
} from "../store/notificationStore";
import {
  addSseClient,
  broadcastNotificationCreated,
  broadcastNotificationDeleted,
  broadcastNotificationRead,
} from "../services/realtimeService";
import { selectPriorityTopK } from "../services/priorityInbox";
import type { CreateNotificationInput, NotificationType } from "../types/notification";

const isNotificationType = (value: unknown): value is NotificationType => {
  return value === "PLACEMENT" || value === "RESULT" || value === "EVENT";
};

export const getNotifications = async (req: Request, res: Response) => {
  const studentIdRaw = req.query.studentId;
  const isReadRaw = req.query.isRead;
  const mode = req.query.mode;

  const studentId =
    typeof studentIdRaw === "string" ? Number(studentIdRaw) : undefined;

  const isRead =
    typeof isReadRaw === "string" ? isReadRaw === "true" : undefined;

  const filters = {
    studentId: Number.isFinite(studentId as number) ? (studentId as number) : undefined,
    isRead,
  };

  await Log("backend", "info", "controller", "Listing notifications");

  const data = listNotifications(filters);

  if (mode === "priority") {
    return res.json({ notifications: selectPriorityTopK(data, 10) });
  }

  return res.json({ notifications: data });
};

export const postNotification = async (req: Request, res: Response) => {
  await Log("backend", "info", "controller", "Creating notification");

  const body = req.body as Partial<CreateNotificationInput>;

  if (!Number.isFinite(body.studentId)) {
    return res.status(400).json({ message: "studentId is required" });
  }
  if (!isNotificationType(body.type)) {
    return res.status(400).json({ message: "type must be PLACEMENT|RESULT|EVENT" });
  }
  if (!body.title || !body.message) {
    return res.status(400).json({ message: "title and message are required" });
  }

  const studentId = Number(body.studentId);

  const created = createNotification({
    studentId,
    type: body.type,
    title: body.title,
    message: body.message,
  });

  broadcastNotificationCreated(created);

  return res.status(201).json(created);
};

export const patchNotificationRead = async (req: Request, res: Response) => {
  await Log("backend", "info", "controller", "Marking notification as read");

  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const updated = markAsRead(id);
  if (!updated) {
    return res.status(404).json({ message: "Notification not found" });
  }

  broadcastNotificationRead(updated);

  return res.json(updated);
};

export const deleteNotificationById = async (req: Request, res: Response) => {
  await Log("backend", "info", "controller", "Deleting notification");

  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  // need studentId for targeted broadcast; best-effort from current data
  const existing = listNotifications().find((n) => n.id === id);
  const ok = deleteNotification(id);

  if (!ok) {
    return res.status(404).json({ message: "Notification not found" });
  }

  if (existing) {
    broadcastNotificationDeleted(existing.studentId, id);
  }

  return res.status(204).send();
};

export const streamNotifications = async (req: Request, res: Response) => {
  const studentIdRaw = req.query.studentId;
  const studentId = typeof studentIdRaw === "string" ? Number(studentIdRaw) : NaN;

  if (!Number.isFinite(studentId)) {
    return res.status(400).json({ message: "studentId query param is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // initial event so clients know they are connected
  res.write("event: connected\n");
  res.write(`data: ${JSON.stringify({ studentId })}\n\n`);

  addSseClient(studentId, res);
};
