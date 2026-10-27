import { AppError } from "../../errors/AppError.js";

export class AIProviderError extends AppError {
    constructor(message = "Le service d'IA est indisponible", statusCode = 503) {
        super(message, statusCode);
    }
}
