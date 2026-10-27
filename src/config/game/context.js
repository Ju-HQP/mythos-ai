export function buildSceneContext(game, action = null, combatResult = null) {
    const { player } = game;

    const context = {
        universe: game.universe,
        difficulty: game.difficulty,
        player: {
            username: player.pseudo ?? player.name ?? "aventurier",
            class: player.playerClass,
            level: player.level,
            pv: player.pv,
            maxPv: player.maxPv
        },
        recentEvents: (game.history ?? []).slice(-5).map(({ action, narration }) => ({ action, narration })),
        action
    };
    if (combatResult){
context.combatResult = combatResult;
    } 
    return context;
}