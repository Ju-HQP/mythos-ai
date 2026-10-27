import jwt from "jsonwebtoken";
import {
    AppError
} from "../errors/AppError.js";

export function requireAuth(request, response, next) {
    const header = request.headers.authorization;

    if (!header ?.startsWith("Bearer ")) {
        throw new AppError("Authentification requise", 401);
    }

    const token = header.slice("Bearer ".length);

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        request.user = {
            id: payload.sub
        };
    } catch(error){
        throw new AppError("Token invalide ou expiré", 401);
    }

    next();
}