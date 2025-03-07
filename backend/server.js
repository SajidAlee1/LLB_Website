import app from "./index.js";
import colors from 'colors'
import Connect from "./db/Connect.js";

await Connect();
app.get("/", (req, res) => {
  res.send("Server is running!");
});
