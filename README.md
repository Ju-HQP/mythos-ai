# Mythos AI

API REST Node.js/Express pour un RPG narratif. Le serveur conserve la maîtrise des statistiques, combats, récompenses, inventaire et sauvegardes. L'IA ne fournit que la narration et les événements structurés.

## Prérequis

- Node.js 20 ou plus récent
- MongoDB accessible
- (Optionnel) Ollama si vous choisissez le fournisseur `ollama`

## Installation

1. `npm ci`
2. Copier `.env.example` vers `.env`, puis adapter `MONGODB_URI` et remplacer `JWT_KEY` par un secret aléatoire.
3. `npm run seed` pour charger les objets de départ.
4. `npm start` (API sur `http://localhost:3000`).

Par défaut, `AI_PROVIDER=mock` permet de jouer sans connexion à un modèle d'IA. Pour Ollama, démarrer Ollama, télécharger un modèle, puis définir `AI_PROVIDER=ollama` et `OLLAMA_MODEL` dans `.env`.

## Parcours API

Toutes les routes de jeu nécessitent `Authorization: Bearer <token>`.

- `POST /api/auth/register` — `{ "username": "joueur", "password": "motdepasse123" }`
- `POST /api/auth/login` — mêmes champs, retourne un JWT
- `POST /api/games` — `{ "pseudo": "Ariane", "class": "Guerrier", "universe": "Fantasy", "difficulty": "normal" }`
- `GET /api/games` — lister ses parties
- `GET /api/games/:id` — reprendre une partie sauvegardée
- `POST /api/games/:id/actions` — `{ "action": "Je suis le sentier", "type": "attack" }` ; en combat, `type` vaut `attack` ou `escape`
- `GET /api/games/:id/inventory` — voir l'inventaire
- `POST /api/games/:id/items/:itemId/equip` — équiper une arme ou une armure
- `POST /api/games/:id/items/:itemId/use` — utiliser un consommable de soin

Les identifiants de partie sont visibles dans la réponse à la création. Les routes de jeu filtrent les parties par utilisateur connecté.

## Commandes

- `npm start` — démarrer
- `npm run dev` — redémarrage automatique en développement
- `npm run seed` — synchroniser le catalogue d'objets
- `npm test` — lancer les tests automatisés
- `npm run check` — vérifier la syntaxe des fichiers d'entrée

Ne jamais committer `.env` ni y placer des secrets dans Git.

## Règles et Statistiques

### Une partie (ou game)
- Possède un personnage, qui enchaînent des actions
- Une action peut engendrer une rencontre avec un ennemi, le joueur a alors le choix d'**Attaquer** ou de **Fuir**
- La partie est perdue si le personnage meurt (perd tous ses pv).
- La partie est gagnée si le joueur atteint la barre des 200 golds

### Un joueur (ou personnage)
- Possède des caractéristiques de bases, réparties selon sa classe; attack, agility, defense, strength
- Possède un niveau d'XP, un nombre de PV et de gold.

#### Gain d'XP
 - Le joueur gagne de l'XP en tuant des monstres. Il ne peut pas en perdre
 - La montée de niveau est exponentielle.

### Argent
 - La monnaie du jeu est le gold. Il s'obtient en tuant des monstres et permet de remporter la partie.
