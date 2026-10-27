import { z } from "zod";
import { ENEMIES } from "../config/game/assets/gameEnemies.js";

export const sceneSchema = z.object({
    narration: z.string().min(1).max(1500),
    choices: z.array(z.string().min(1).max(100)).min(2).max(4),
    event: z
        .object({
            type: z.enum(["none", "encounter"]),
            enemyType: z.enum(Object.keys(ENEMIES)).optional()
        })
        .refine((event) => event.type !== "encounter" || event.enemyType !== undefined, {
            message: "enemyType requis pour une rencontre"
        })
});