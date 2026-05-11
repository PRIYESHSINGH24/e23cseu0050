import { v4 as uuid } from "uuid";
import type { CreateNotificationInput, Notification } from "../types/notification";

const notifications = new Map<string, Notification>();

export const listNotifications = (filters?: {
  studentId?: number;
  isRead?: boolean;
}): Notification[] => {
  const all = Array.from(notifications.values());

  return all
    .filter((n) => {
      if (filters?.studentId !== undefined && n.studentId !== filters.studentId) {
        return false;
      }
      if (filters?.isRead !== undefined && n.isRead !== filters.isRead) {
        return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const createNotification = (input: CreateNotificationInput): Notification => {
  const now = new Date().toISOString();

  const created: Notification = {
    id: uuid(),
    studentId: input.studentId,
    type: input.type,
    title: input.title,
    message: input.message,
    isRead: false,
    createdAt: now,
  };

  notifications.set(created.id, created);
  return created;
};

export const markAsRead = (id: string): Notification | null => {
  const existing = notifications.get(id);
  if (!existing) return null;

  if (existing.isRead) return existing;

  const updated: Notification = {
    ...existing,
    isRead: true,
    readAt: new Date().toISOString(),
  };

  notifications.set(id, updated);
  return updated;
};

export const deleteNotification = (id: string): boolean => {
  return notifications.delete(id);
};
