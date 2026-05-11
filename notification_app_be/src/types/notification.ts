export type NotificationType = "PLACEMENT" | "RESULT" | "EVENT";

export type Notification = {
  id: string;
  studentId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO
  readAt?: string; // ISO
};

export type CreateNotificationInput = {
  studentId: number;
  type: NotificationType;
  title: string;
  message: string;
};
