import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "DevPulse API running"
    });
});

app.use("/api/auth", authRoutes);

export default app;