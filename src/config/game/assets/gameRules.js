export const RULES = {
    critChance: 0.14,
    critMultiplier: 1.8,

    escapeBaseChance: 0.25,       // chance de fuite à l'agilité de référence
    escapeReferenceAgility: 8,    // agilité d'un Humain
    escapeChancePerAgility: 0.03, // par point d'agilité d'écart
    escapeMinChance: 0.05,
    escapeMaxChance: 0.9,

    dropChance: 1, //chance de drop des items après un fight
    goldToWin: 200,

    xpFirstLevel: 30,           // XP pour passer du niveau 1 au niveau 2
    xpGrowth: 1.5,              // chaque niveau demande 1,5 fois plus
    levelUp: { primaryStat: 3, otherStat: 1, maxPv: 10 } // primaryStat dépend de la classe choisi -> ex : Force pour le Guerrier
};