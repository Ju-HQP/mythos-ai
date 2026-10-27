import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // 3 types d'items, pour orienter Ollama
    type: {
        type: String,
        enum: ["weapon", "armor", "consumable"],
        required: true
    },
    stats: {
        attack: {
            type: Number,
            default: 0,
            min: 0
        },
        defense: {
            type: Number,
            default: 0,
            min: 0
        },
        heal: {
            type: Number,
            default: 0,
            min: 0
        }
    }
});

const Item = mongoose.model("Item", itemSchema);
export default Item;