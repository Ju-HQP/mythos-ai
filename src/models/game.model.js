import mongoose from "mongoose";
// import des classes de perso
import {
    CLASSES,
    DEFAULT_CLASS
} from "../config/game/assets/gameClasses.js";

// La game contient le joueur (pseudo, classe,lvl, xp, pv, gold, stats, inventaire) + les fights

const playerSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        trim: true
    },
    playerClass: {
        type: String,
        enum: Object.keys(CLASSES),
        default: DEFAULT_CLASS // humain
    },
    level: {
        type: Number,
        default: 1,
        min: 1
    },
    xp: {
        type: Number,
        default: 0,
        min: 0
    },
    pv: {
        type: Number,
        required: true,
        min: 0
    },
    maxPv: {
        type: Number,
        required: true,
        min: 1
    },
    gold: {
        type: Number,
        default: 0,
        min: 0
    },
    stats: {
        strength: {
            type: Number,
            required: true
        },
        agility: {
            type: Number,
            required: true
        },
        intelligence: {
            type: Number,
            required: true
        },
        defense: {
            type: Number,
            required: true
        }
    },
    inventory: [
        // objet item dans l'inventaire
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item",
                required: true
            },
            // augmenente de 1 si item déjà présent dans l'inv
            // évite de recréer l'objet
            quantity: {
                type: Number,
                default: 1,
                min: 1
            },
            equipped: {
                type: Boolean,
                default: false
            }
        }
    ],
}, {
    _id: false
});

// schéma de l'historique de game -> Une ligne = action, phrase générée, type d'Event
const historyEntrySchema = new mongoose.Schema(
    {
        action: { type: String, required: true },
        narration: { type: String, required: true },
        eventType: { type: String, default: "none" },
    },
    { _id: false }
);

// schéma d'un fight -> type d'ennemi, pv, points d'attaque et de défense
const fightSchema = new mongoose.Schema(
    {
        enemyType: { type: String, required: true },
        enemyPv: { type: Number, required: true, min: 0 },
        enemyMaxPv: { type: Number, required: true },
        enemyAttack: { type: Number, required: true },
        enemyDefense: { type: Number, required: true }
    },
    { _id: false }
);

const gameSchema = new mongoose.Schema({
    // 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    universe: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "normal", "hard"],
        required: true,
        default: "easy"
    },
    status: {
        type: String,
        enum: ["active", "won", "lost"],
        default: "active"
    },
    // créer Player dans la collection Game
    player:{
        type: playerSchema,
        required: true
    },
    currentScene: {
        narration: {
            type: String,
            default: ""
        },
        choices: {
            type: [String],
            default: []
        }
    },
    fight: {
        type: fightSchema,
        default: null
    },
    history: {
        type: [historyEntrySchema],
        default: [] // historique vide à la création
    }
});

const Game = mongoose.model("Game", gameSchema);
export default Game;