import app from "./index.js";
import colors from 'colors'
import Connect from "./db/Connect.js";

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen('/https://llbbackend.vercel.app',async()=>{
  await Connect();
    console.log(`My app is running on ${process.env.PORT}`.yellow)
})
