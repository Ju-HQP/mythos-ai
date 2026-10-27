import {
    AIProvider
} from "./AIProvider.js";
import { AIProviderError } from "./AIProviderError.js";
import {
    buildMessages,
    EVENT_JSON_SCHEMA
} from "./prompt.js";

export class OllamaProvider extends AIProvider {
    constructor({
        baseUrl,
        model,
        timeoutMs
    }) {
        super();
        this.baseUrl = baseUrl;
        this.model = model;
        this.timeoutMs = timeoutMs;
    }

    // requête envoyé à Ollamaa
    async generateScene(context) {
        let response;
        try {
            response = await fetch(`${this.baseUrl}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // infos requêtes
                body: JSON.stringify({
                    model: this.model, // modèle d'Ollama
                    messages: buildMessages(context),
                    stream: false, // pour avoir une réponse complète et structurée de l'IA plutôt que fragmentée
                    format: EVENT_JSON_SCHEMA,
                    options: {
                        temperature: 0.6 // indice de diversité des réponses
                    }
                }),
                signal: AbortSignal.timeout(this.timeoutMs) // définit un délai maximal pour la requête
            });
        } catch (error) {
            if (error.name === "TimeoutError") {
                throw new AIProviderError("Ollama a mis trop de temps à répondre", 504);
            }
            throw new AIProviderError("Ollama est injoignable (est-il lancé ?)", 503);
        }

        if (!response.ok) {
            throw new AIProviderError(`Ollama a répondu avec le statut ${response.status}`, 502);
        }

        try {
            const data = await response.json();
            return JSON.parse(data.message.content);
        } catch {
            throw new AIProviderError("Réponse d'Ollama non exploitable", 502);
        }
    }
}