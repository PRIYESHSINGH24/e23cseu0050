import express from "express";

import scheduleRoutes from "./routes/scheduleRoutes";

const app = express();

app.use(express.json());

app.use("/schedule", scheduleRoutes);

export default app;
