import Game from "../../models/game.model.js";
import { CLASSES } from "../../config/game/assets/gameClasses.js";
import { parseCreateGame } from "../../validators/game.validator.js";
import { AIProviderError } from "../ai/AIProviderError.js";
import { generateScene, FALLBACK_SCENE } from "../ai/scene.service.js";
import { buildSceneContext } from "../../config/game/context.js";

/**
 * 
 * @param {*} userId fourni par JWT via le middleware
 * @param {*} body 
 * @returns 
 */
export async function createGame(userId, body) {
    const { pseudo, playerClass, universe, difficulty } = parseCreateGame(body);
    const base = CLASSES[playerClass];

    const player = {
        pseudo,
        playerClass,
        level: 1,
        pv: base.maxPv,
        maxPv: base.maxPv,
        gold: base.startingGold,
        stats: {
            strength: base.strength,
            agility: base.agility,
            intelligence: base.intelligence,
            defense: base.defense
        }
    };

    // Scène d'ouverture : si Ollama est éteint, la partie est quand même créée
    let scene;
    try {
        scene = await generateScene(buildSceneContext({ universe, difficulty, player }));
    } catch (error) {
        if (!(error instanceof AIProviderError)) throw error;
        console.warn("IA indisponible, scène de secours utilisée :", error.message);
        scene = FALLBACK_SCENE;
    }

    return Game.create({
        user: userId,
        universe,
        difficulty,
        player,
        currentScene: { narration: scene.narration, choices: scene.choices }
    });
}