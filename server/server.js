import express from "express"
import dotenv from "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js";

// create express app using http server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// connecting to mongodb
await connectDB();

app.use("/api/status", (req, res) => {
    res.send("Server is live");
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`)
})