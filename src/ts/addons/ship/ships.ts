import { Ship } from "./ship";

/**
 * The ships that the player can interact with.
 * Tip: ships[0] is ALWAYS the master ship, all playable characters are stored there.
 */
export const ships: Ship[] = [];
export function getShipById(id: string): Ship | undefined {
    return ships.find(e => e.id == id);
}

export function removeShip(ship: Ship) {
    document.getElementById(ship.id)?.remove();
    ships.splice(ships.findIndex(s => s == ship), 1)
}
