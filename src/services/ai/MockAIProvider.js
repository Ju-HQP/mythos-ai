import { AIProvider } from "./AIProvider.js";

// JEU DE DONNEES POUR TEST OU UTILISER MythosAI sans l'IA (le comble)
export class MockAIProvider extends AIProvider {

    async generateScene(context) {
        if (context.combatResult) {
            const {
                outcome,
                enemy
            } = context.combatResult;
            const narrations = {
                ongoing: `Le combat contre ${enemy} continue, les coups s'échangent.`,
                victory: `${enemy} s'effondre : tu remportes le combat.`,
                defeat: `${enemy} t'accable. Tes forces t'abandonnent.`,
                fled: `Tu t'échappes de justesse, ${enemy} perd ta trace.`
            };
            return {
                narration: narrations[outcome],
                choices: outcome === "ongoing" ? ["Attaquer", "Fuir"] : ["Continuer", "Observer les alentours"],
                event: {
                    type: "none"
                }
            };
        }
        const action = (context.action ?? "").toLowerCase();

        if (context.action === null) {
            return {
                narration: `Tu t'éveilles dans un monde de ${context.universe}. Un sentier mène vers des ruines.`,
                choices: ["Suivre le sentier", "Fouiller les alentours"],
                event: {
                    type: "none"
                }
            };
        }
        if (action.includes("attaque") || action.includes("approche")) {
            return {
                narration: "Un gobelin surgit des ruines en brandissant sa lame.",
                choices: ["Combattre", "Fuir"],
                event: {
                    type: "encounter",
                    enemyType: "goblin"
                }
            };
        }
        return {
            narration: "Le silence règne. Rien ne bouge autour de toi.",
            choices: ["Avancer", "Attendre"],
            event: {
                type: "none"
            }
        };
    }
}