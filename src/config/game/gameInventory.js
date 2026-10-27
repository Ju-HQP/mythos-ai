// ajouter un objet ou augmente sa quantité si déjà présent
export function addItem(player, item) {
    const entry = player.inventory.find((e) => e.item._id.equals(item._id));

    if (entry) {
        entry.quantity += 1;
    } else {
        player.inventory.push({ item: item._id, quantity: 1 });
    }
}