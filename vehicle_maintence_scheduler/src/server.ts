import app from "./app";

console.log("SERVER FILE STARTED");

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err: any) => {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other server or run with PORT=${PORT + 1}.`
    );
    process.exit(1);
  }

  console.error("Server failed to start:", err);
  process.exit(1);
});