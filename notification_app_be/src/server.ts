import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 6060;

app.listen(PORT, () => {
  console.log(`Notification backend running on ${PORT}`);
});
