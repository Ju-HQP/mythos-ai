import Game from "../models/game.model.js";
import * as gameService from '../services/game/game.service.js';
import {
  playAction
} from "../services/game/action.service.js";

import {
  AppError
} from "../errors/AppError.js";

export async function getGame(req, res) {
  const game = await Game.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  if (!game) throw new AppError("Partie introuvable", 404);

  return res.status(200).json(game);
}

export async function getGames(req, res) {
  const games = await Game.find({
    user: req.user.id
  });
  if (!games) throw new AppError("Partie introuvable", 404);

  return res.status(200).json(games);
}


export async function createGame(request, response) {
  // logique métier dans le service pour aérer
  const game = await gameService.createGame(request.user.id, request.body);
  return response.status(201).json(game);
}

export async function doInGame(req, res) {
  // params : id user, id game, action
  const result = await playAction(req.user.id, req.params.id, req.body);
  return res.status(200).json(result);
}

export async function getInventory(req, res) {
  const game = await Game.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate("player.inventory.item");
  if (!game) throw new AppError("Partie introuvable", 404);
  return res.status(200).json(game.player.inventory);
}

export async function equipItem(req, res) {
  const game = await Game.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate("player.inventory.item");
  if (!game) throw new AppError("Partie introuvable", 404);
  if (game.status !== "active") throw new AppError("La partie est terminée", 409);
  const entry = game.player.inventory.find((e) => String(e.item ?._id) === req.params.itemId);
  if (!entry) throw new AppError("Objet absent de l'inventaire", 404);
  if (!["weapon", "armor"].includes(entry.item.type)) throw new AppError("Cet objet ne peut pas être équipé", 400);
  for (const other of game.player.inventory) {
    if (other.item?.type === entry.item.type) other.equipped = false;
  }
  entry.equipped = true;
  await game.save();
  return res.status(200).json({
    message: "Objet équipé",
    inventory: game.player.inventory
  });
}

export async function useItem(req, res) {
  const game = await Game.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate("player.inventory.item");
  if (!game) throw new AppError("Partie introuvable", 404);
  if (game.status !== "active") throw new AppError("La partie est terminée", 409);
  const entry = game.player.inventory.find((e) => String(e.item ?._id) === req.params.itemId);
  if (!entry) throw new AppError("Objet absent de l'inventaire", 404);
  if (entry.item.type !== "consumable") throw new AppError("Cet objet n'est pas consommable", 400);
  const heal = Number(entry.item.stats?.heal ?? 0);
  if (heal <= 0) throw new AppError("Cet objet ne soigne pas", 400);
  const before = game.player.pv;
  game.player.pv = Math.min(game.player.maxPv, game.player.pv + heal);
  if (game.player.pv === before) throw new AppError("Les points de vie sont déjà au maximum", 409);
  entry.quantity -= 1;
  if (entry.quantity <= 0) game.player.inventory = game.player.inventory.filter((e) => e !== entry);
  await game.save();
  return res.status(200).json({
    message: "Objet utilisé",
    healed: game.player.pv - before,
    player: game.player
  });
}