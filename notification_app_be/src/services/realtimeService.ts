import type { Response } from "express";
import type { Notification } from "../types/notification";

type Client = {
  studentId: number;
  res: Response;
};

const clients = new Set<Client>();

export const addSseClient = (studentId: number, res: Response) => {
  const client: Client = { studentId, res };
  clients.add(client);

  res.on("close", () => {
    clients.delete(client);
  });
};

const sendEvent = (res: Response, event: string, data: unknown) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

export const broadcastToStudent = (
  studentId: number,
  event: string,
  payload: unknown
) => {
  for (const client of clients) {
    if (client.studentId !== studentId) continue;
    sendEvent(client.res, event, payload);
  }
};

export const broadcastNotificationCreated = (notification: Notification) => {
  broadcastToStudent(notification.studentId, "notification:new", notification);
};

export const broadcastNotificationRead = (notification: Notification) => {
  broadcastToStudent(notification.studentId, "notification:read", notification);
};

export const broadcastNotificationDeleted = (studentId: number, id: string) => {
  broadcastToStudent(studentId, "notification:deleted", { id });
};
