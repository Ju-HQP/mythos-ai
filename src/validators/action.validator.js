import { AppError } from "../errors/AppError.js";

// vérifie le format de données pour une requête d'actions
export function parseAction(body) {
    const { action, type } = body ?? {};

    if (typeof action !== "string" || action.trim().length < 1 || action.trim().length > 200) {
        throw new AppError("action : 1 à 200 caractères", 400);
    }
    if (type !== undefined && !["attack", "escape"].includes(type)) {
        throw new AppError("Types d'actions possibles : attack ou escape", 400);
    }

    return { text: action.trim(), type: type ?? "attack" };
}