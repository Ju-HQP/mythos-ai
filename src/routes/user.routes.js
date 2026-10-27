import {
    Router
} from "express";

import {
    createUser,
    loginUser
} from "../controllers/user.controller.js";

// Route du joueur

const router = Router();

router.post("/auth/register", createUser);

router.post("/auth/login", loginUser);


export default router;