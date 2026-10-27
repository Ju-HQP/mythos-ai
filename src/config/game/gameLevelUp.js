import { CLASSES } from "./assets/gameClasses.js";
import { RULES } from "./assets/gameRules.js";

// XP nécessaire pour passer au niveau suivant : 30 au lvl 1 puis exponentiel
// À chaque niveau, la stat primaire gagne +3, les autres +1, et les PV max +10 avec soin complet

export function xpForNextLevel(level) {
    return Math.round(RULES.xpFirstLevel * RULES.xpGrowth ** (level - 1));
}

function levelUp(player) {
    const { primaryStat } = CLASSES[player.playerClass];
    const gains = RULES.levelUp;

    for (const stat of ["strength", "agility", "intelligence", "defense"]) {
        player.stats[stat] += stat === primaryStat ? gains.primaryStat : gains.otherStat;
    }
    player.maxPv += gains.maxPv;
    player.pv = player.maxPv; // soin complet à chaque niveau passé
    player.level += 1;
}

// Ajoute de l'XP et gère les montées de niveau
export function addXp(player, amount) {
    player.xp += amount;
    let levelsGained = 0;

    while (player.xp >= xpForNextLevel(player.level)) {
        player.xp -= xpForNextLevel(player.level);
        levelUp(player);
        levelsGained++;
    }
    return levelsGained;
}