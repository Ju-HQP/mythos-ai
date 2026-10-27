// Liste des ennemis
export const ENEMIES = {
    goblin: {
        name: "Gobelin", hp: 20, attack: 8, defense: 1, xpReward: 10, goldReward: 5,
        loot: ["Couteau usé", "Vêtements renforcés", "Petite trousse de soin"]
    },
    wolf: {
        name: "Loup", hp: 28, attack: 10, defense: 2, xpReward: 14, goldReward: 0,
        loot: ["Veste épaisse", "Petite trousse de soin"]
    },
    skeleton: {
        name: "Squelette", hp: 32, attack: 11, defense: 3, xpReward: 18, goldReward: 8,
        loot: ["Bâton renforcé", "Bouclier improvisé", "Petite trousse de soin"]
    },
    bandit: {
        name: "Bandit", hp: 38, attack: 12, defense: 4, xpReward: 22, goldReward: 20,
        loot: ["Lame solide", "Armure légère", "Trousse de soin"]
    },
    orc: {
        name: "Orc", hp: 55, attack: 15, defense: 5, xpReward: 35, goldReward: 15,
        loot: ["Arme lourde", "Armure lourde", "Trousse de soin"]
    },
    troll: {
        name: "Troll", hp: 80, attack: 18, defense: 7, xpReward: 60, goldReward: 30,
        loot: ["Arme d'élite", "Armure d'élite", "Grande trousse de soin"]
    }
};