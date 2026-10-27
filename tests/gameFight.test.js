import test from "node:test";
import assert from "node:assert/strict";
import { startFight, resolveTurn } from "../src/config/game/gameFight.js";

test("startFight initialise des PV valides selon la difficulté", () => {
  const easy = startFight("goblin", "easy");
  const hard = startFight("goblin", "hard");
  assert.ok(easy.enemyPv > 0);
  assert.equal(easy.enemyPv, easy.enemyMaxPv);
  assert.ok(hard.enemyPv > easy.enemyPv);
});

test("un coup fatal donne une victoire sans riposte ennemie", () => {
  const player = { playerClass: "Guerrier", pv: 50, maxPv: 50, stats: { strength: 100, agility: 8, intelligence: 1, defense: 10 }, inventory: [] };
  const fight = { enemyType: "goblin", enemyPv: 1, enemyMaxPv: 1, enemyAttack: 10, enemyDefense: 0 };
  const result = resolveTurn(player, fight, "attack", () => 0.99);
  assert.equal(result.outcome, "victory");
  assert.equal(fight.enemyPv, 0);
  assert.equal(result.enemyHit, null);
  assert.equal(player.pv, 50);
});

test("une attaque ennemie fatale donne une défaite", () => {
  const player = { playerClass: "Humain", pv: 1, maxPv: 10, stats: { strength: 1, agility: 8, intelligence: 1, defense: 0 }, inventory: [] };
  const fight = { enemyType: "goblin", enemyPv: 100, enemyMaxPv: 100, enemyAttack: 20, enemyDefense: 0 };
  const result = resolveTurn(player, fight, "attack", () => 0.99);
  assert.equal(result.outcome, "defeat");
  assert.equal(player.pv, 0);
});

test("une fuite réussie utilise le statut fled", () => {
  const player = { playerClass: "Humain", pv: 10, maxPv: 10, stats: { strength: 1, agility: 8, intelligence: 1, defense: 0 }, inventory: [] };
  const fight = { enemyType: "goblin", enemyPv: 10, enemyMaxPv: 10, enemyAttack: 20, enemyDefense: 0 };
  const result = resolveTurn(player, fight, "escape", () => 0);
  assert.equal(result.outcome, "fled");
  assert.equal(result.enemyHit, null);
});
