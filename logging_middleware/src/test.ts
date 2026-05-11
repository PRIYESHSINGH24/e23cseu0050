import { Log } from "./logger";

async function testLogger() {
  console.log("STARTING LOGGER TEST");

  await Log(
    "backend",
    "info",
    "service",
    "Logging middleware started successfully"
  );

  console.log("LOGGER FINISHED");
}

testLogger();