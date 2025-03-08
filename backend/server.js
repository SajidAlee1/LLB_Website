import dotenv from 'dotenv';

import app from "./index.js";
import colors from 'colors'
import Connect from "./db/Connect.js";

dotenv.config();
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(process.env.PORT,async()=>{
  await Connect();
    console.log(`My app is running on ${process.env.PORT}`.yellow)
})
