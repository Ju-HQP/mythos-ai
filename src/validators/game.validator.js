import { CLASSES, DEFAULT_CLASS } from "../config/game/assets/gameClasses.js";
import { DIFFICULTIES } from "../config/game/assets/gameDifficulties.js";
import { AppError } from "../errors/AppError.js";

function isText(value, min, max) {
    return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}
// fonction de validation de format des données de création d'une partie
export function parseCreateGame(body) {
    const { pseudo, universe, difficulty } = body ?? {};
    const playerClass = body?.class ?? DEFAULT_CLASS;
    const errors = [];

    if (!isText(pseudo, 2, 30)) errors.push("Votre pseudo doit faire de 2 à 30 caractères");
    if (!isText(universe, 2, 50)) errors.push("L'univers doit fair de 2 à 50 caractères");

    // vérification si la difficulté précisée par le joueur est inclus -> easy,normal,hard 
    if (typeof difficulty !== "string" || !Object.hasOwn(DIFFICULTIES, difficulty)) {
        errors.push(`Liste des niveaux de difficulté : ${Object.keys(DIFFICULTIES).join(", ")}`);
    }
    // pareil pour les classes de joueur
    if (typeof playerClass !== "string" || !Object.hasOwn(CLASSES, playerClass)) {
        errors.push(`Listes des classes possibles : ${Object.keys(CLASSES).join(", ")}`);
    }

    if (errors.length > 0) {
        throw new AppError(`Données invalides : ${errors.join(" ; ")}`, 400);
    }

    return {
        pseudo: pseudo.trim(),
        universe: universe.trim(),
        difficulty,
        playerClass
    };
}