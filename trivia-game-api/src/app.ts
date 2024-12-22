import express from "express";
import authRouter from "../src/routes/auth.routes";
import { exceptionMiddleware } from "./middlewares/exception.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";
import gameRouter from "./routes/game.routes";

export const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/games", authMiddleware, gameRouter);
app.use(exceptionMiddleware);
