import Game from "../../models/game.model.js";
import Item from "../../models/item.model.js";
import { AppError } from "../../errors/AppError.js"; 
import { ENEMIES } from "../../config/game/assets/gameEnemies.js";
import { startFight, resolveTurn } from "../../config/game/gameFight.js";
import { computeRewards, applyRewards, hasWon } from "../../config/game/gameRewards.js";
import { addItem } from "../../config/game/gameInventory.js";
import { buildSceneContext } from "../../config/game/context.js";
import { parseAction } from "../../validators/action.validator.js";
import { generateScene } from "../ai/scene.service.js";


// LOGIQUE DE DEROULEMENT D'UNE ACTIONs

const MAX_HISTORY = 20;

// tour de fight
async function resolveFight(game, type) {
    const { player, fight } = game;
    const turn = resolveTurn(player, fight, type);

    const result = {
        enemy: ENEMIES[fight.enemyType].name,
        playerAction: type,
        outcome: turn.outcome,
        damageDealt: turn.playerHit?.damage ?? 0,
        damageTaken: turn.enemyHit?.damage ?? 0,
        criticalDealt: turn.playerHit?.critical ?? false,
        criticalTaken: turn.enemyHit?.critical ?? false,
        enemyPv: fight.enemyPv
    };

    if (turn.outcome === "victory") {
        const rewards = computeRewards(fight.enemyType, game.difficulty);
        const { levelsGained } = applyRewards(player, rewards);

        const item = rewards.lootName ? await Item.findOne({ name: rewards.lootName }) : null;
        if (rewards.lootName && !item) console.warn(`Objet introuvable en base : ${rewards.lootName} (seed lancé ?)`);
        if (item) addItem(player, item);

        result.rewards = { xp: rewards.xp, gold: rewards.gold, loot: item?.name ?? null, levelsGained };
        if (hasWon(player)) game.status = "won";
    }

    if (turn.outcome === "defeat") game.status = "lost";
    if (turn.outcome !== "ongoing") game.fight = null;

    result.gameStatus = game.status;
    return result;
}

export async function playAction(userId, gameId, body) {
    const { text, type } = parseAction(body);

    const game = await Game
        .findOne({ _id: gameId, user: userId })
        .populate("player.inventory.item"); // recherche les objets présents dans l'inv

    if (!game) throw new AppError("Partie introuvable", 404);
    if (game.status !== "active") throw new AppError("La partie est terminée", 409);

    // action est choisie
    // si fight
    const fightResult = game.fight ? await resolveFight(game, type) : null;
    // puis on passe à la prochaine narration
    const scene = await generateScene(buildSceneContext(game, text, fightResult));

    // Une rencontre n'est acceptée que hors fight
    if (!fightResult && scene.event.type === "encounter") {
        game.fight = startFight(scene.event.enemyType, game.difficulty);
    }

    game.currentScene = { narration: scene.narration, choices: scene.choices };
    // ajout de l'event dans l'historique
    game.history.push({
        action: text,
        narration: scene.narration.slice(0, 500),
        eventType: fightResult ? `fight_${fightResult.outcome}` : scene.event.type
    });
    if (game.history.length > MAX_HISTORY) {
        game.history.splice(0, game.history.length - MAX_HISTORY);
    }

    await game.save();

    return {
        status: game.status,
        scene: game.currentScene,
        fight: game.fight,
        player: game.player,
        turn: fightResult
    };
}