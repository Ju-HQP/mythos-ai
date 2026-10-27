// Génération des objets en BDD

import mongoose from "mongoose";
import Item from "../../models/item.model.js";
import { ITEMS } from "../game/assets/gameItems.js";
import { connectDatabase } from "../database.js";

await connectDatabase();

for (const item of ITEMS) {
    await Item.updateOne({ name: item.name }, item, { upsert: true });
}

console.log(`${ITEMS.length} objets présents en base`);
await mongoose.disconnect();