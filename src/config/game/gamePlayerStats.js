import { CLASSES } from "./assets/gameClasses.js";

// calcule les statistiques du joueur par rapport à ses objets et ses stats de base
export function getEffectiveStats(player) {
    const equipped = player.inventory.filter((entry) => entry.equipped);
    const bonus = (key) => equipped.reduce((sum, entry) => sum + (entry.item.stats[key] ?? 0), 0);
    const { primaryStat } = CLASSES[player.playerClass];

    return {
        attack: player.stats[primaryStat] + bonus("attack"),
        defense: player.stats.defense + bonus("defense"),
        agility: player.stats.agility
    };
}