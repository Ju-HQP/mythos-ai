import express from "express";
import userRoutes from "./routes/user.routes.js";
import gameRoutes from "./routes/game.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requireAuth } from "./middlewares/auth.middleware.js";


const app = express();
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/games", requireAuth, gameRoutes); 

// middleware d'erreur
app.use(errorHandler);

export default app;