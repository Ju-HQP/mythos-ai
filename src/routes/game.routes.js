import { Router } from "express";
import { createGame, getGames, getGame, doInGame, getInventory, equipItem, useItem } from "../controllers/game.controller.js";

const router = Router();

router.post("/", createGame);
router.get("/", getGames);
router.get("/:id", getGame);
router.post("/:id/actions", doInGame);
router.get("/:id/inventory", getInventory);
router.post("/:id/items/:itemId/equip", equipItem);
router.post("/:id/items/:itemId/use", useItem);

export default router;
