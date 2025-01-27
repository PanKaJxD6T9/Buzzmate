import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use("/api/auth", AuthRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});