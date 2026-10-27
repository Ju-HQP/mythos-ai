export const DEFAULT_CLASS = "Humain";

export const CLASSES = {
    Humain: {
        primaryStat: "strength",
        maxPv: 80,
        strength: 8,
        agility: 8,
        intelligence: 8,
        defense: 6,
        startingGold: 15
    },
    Guerrier: {
        primaryStat: "strength",
        maxPv: 100,
        strength: 14,
        agility: 7,
        intelligence: 3,
        defense: 10,
        startingGold: 10
    },
    Mage: {
        primaryStat: "intelligence",
        maxPv: 60,
        strength: 4,
        agility: 6,
        intelligence: 14,
        defense: 3,
        startingGold: 20
    },
    Voleur: {
        primaryStat: "agility",
        maxPv: 75,
        strength: 8,
        agility: 14,
        intelligence: 6,
        defense: 5,
        startingGold: 30
    }
};