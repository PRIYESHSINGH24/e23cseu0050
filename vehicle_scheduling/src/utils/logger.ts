export const Log = async (
  stack: string,
  level: "info" | "warn" | "error",
  pkg: string,
  message: string
) => {
  console.log(`[${stack}] [${level}] ${pkg}: ${message}`);
};
