import express from "express";

import {
  deleteNotificationById,
  getNotifications,
  patchNotificationRead,
  postNotification,
  streamNotifications,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/", getNotifications);
router.post("/", postNotification);
router.patch("/:id/read", patchNotificationRead);
router.delete("/:id", deleteNotificationById);

// realtime via SSE
router.get("/stream", streamNotifications);

export default router;
