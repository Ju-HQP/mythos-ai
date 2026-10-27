import { ENEMIES } from "./assets/gameEnemies.js";
import { DIFFICULTIES } from "./assets/gameDifficulties.js";
import { RULES } from "./assets/gameRules.js";
import { getEffectiveStats } from "./gamePlayerStats.js";

// Crée l'état du fight. La difficulté renforce les PV et l'attaque de l'ennemi.
export function startFight(enemyType, difficulty) {
    const enemy = ENEMIES[enemyType];
    const { enemyMultiplier } = DIFFICULTIES[difficulty];
    const pv = Math.max(1, Math.round(enemy.hp * enemyMultiplier));

    return {
        enemyType,
        enemyPv: pv,
        enemyMaxPv: pv,
        enemyAttack: Math.round(enemy.attack * enemyMultiplier),
        enemyDefense: enemy.defense
    };
}
// calcul dégât infligé
function rollDamage(attack, defense, random) {
    const base = Math.max(1, attack - defense);
    const critical = random() < RULES.critChance;
    return { damage: critical ? Math.round(base * RULES.critMultiplier) : base, critical };
}

function playerAttacks(player, fight, random) {
    // récupère les stats du joueur
    const { attack } = getEffectiveStats(player);
    const hit = rollDamage(attack, fight.enemyDefense, random);
    fight.enemyPv = Math.max(0, fight.enemyPv - hit.damage);
    return hit;
}

function enemyAttacks(player, fight, random) {
    const { defense } = getEffectiveStats(player);
    const hit = rollDamage(fight.enemyAttack, defense, random);
    player.pv = Math.max(0, player.pv - hit.damage);
    return hit;
}

function tryEscape(player, random) {
    const { agility } = getEffectiveStats(player);
    const chance = RULES.escapeBaseChance + (agility - RULES.escapeReferenceAgility) * RULES.escapeChancePerAgility;
    const clamped = Math.min(RULES.escapeMaxChance, Math.max(RULES.escapeMinChance, chance));
    return random() < clamped;
}

// Un tour -> le joueur agit, puis l'ennemi riposte s'il est encore là.
// action = "attack" ou "escape". L'IA narre le résultat
export function resolveTurn(player, fight, action, random = Math.random) {
    const result = { action, playerHit: null, enemyHit: null, outcome: "ongoing" };

    if (action === "escape") {
        if (tryEscape(player, random)) {
            result.outcome = "fled";
            return result;
        }
    } else {
        result.playerHit = playerAttacks(player, fight, random);
        if (fight.enemyPv === 0) {
            result.outcome = "victory";
            return result;
        }
    }

    result.enemyHit = enemyAttacks(player, fight, random);
    if (player.pv === 0) result.outcome = "defeat";
    return result;
}