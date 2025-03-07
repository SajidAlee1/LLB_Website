import app from "./index.js";
import colors from 'colors'
import Connect from "./db/Connect.js";

try {
  await Connect();
  console.log("Database Connected Successfully");
} catch (error) {
  console.error("Database Connection Failed:", error);
}

// Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});
