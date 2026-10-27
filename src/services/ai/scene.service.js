import { OllamaProvider } from "../ai/OllamaProvider.js";
import { MockAIProvider } from "../ai/MockAIProvider.js";
import { sceneSchema } from "../../validators/scene.validator.js";
import { AIProviderError } from "./AIProviderError.js";

const aiProvider = process.env.AI_PROVIDER === "ollama"
    ? new OllamaProvider({
        baseUrl: process.env.OLLAMA_URL || "http://localhost:11434",
        model: process.env.OLLAMA_MODEL || "llama3.2",
        timeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS) || 60000
    })
    : new MockAIProvider(); // si aucune variable ou AI_PROVIDER = mock par exemple, on utilisera le mock
console.log("Fournisseur d'IA :", aiProvider.constructor.name);
export const FALLBACK_SCENE = {
    narration: "Le brouillard se lève lentement. Tu reprends tes esprits et observes les environs.",
    choices: ["Avancer prudemment", "Observer les alentours"],
    event: { type: "none" }
};

export async function generateScene(context) {
    // Si la scène échoue on reesaie une fois
    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const raw = await aiProvider.generateScene(context);
            return sceneSchema.parse(raw);
        } catch (error) {
            // Ollama éteint (503) ou trop lent (504) : inutile de réessayer
            const isDown = error instanceof AIProviderError && error.statusCode !== 502;
            if (isDown) {
                console.warn("IA indisponible, scène de secours utilisée :", error.message);
                return FALLBACK_SCENE;
            }
            console.warn(`Scène invalide (tentative ${attempt}) :`, error.message);
        }
    }
    return FALLBACK_SCENE;
}