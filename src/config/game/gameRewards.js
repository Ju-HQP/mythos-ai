import { ENEMIES } from "./assets/gameEnemies.js";
import { DIFFICULTIES } from "./assets/gameDifficulties.js";
import { RULES } from "./assets/gameRules.js";
import { addXp } from "./gameLevelUp.js";

// Calcule le butin d'une victoire. lootName vaut null si aucun objet ne tombe.
export function computeRewards(enemyType, difficulty, random = Math.random) {
    const enemy = ENEMIES[enemyType];
    const { rewardMultiplier } = DIFFICULTIES[difficulty];

    const dropsLoot = random() < RULES.dropChance;
    const lootName = dropsLoot ? enemy.loot[Math.floor(random() * enemy.loot.length)] : null;

    return {
        xp: Math.round(enemy.xpReward * rewardMultiplier),
        gold: Math.round(enemy.goldReward * rewardMultiplier),
        lootName
    };
}

// Applique l'or et l'XP au personnage. L'objet est ajouté par le service d'inventaire.
export function applyRewards(player, rewards) {
    player.gold += rewards.gold;
    return { levelsGained: addXp(player, rewards.xp) };
}

export function hasWon(player) {
    return player.gold >= RULES.goldToWin;
}