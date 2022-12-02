import { Ship } from "./ship";

/**
 * The main ship.
 */
export let mainShip: Ship;
export function setMainShip(ship: Ship) {
    mainShip = ship;
}

// export function getShipById(id: string): Ship | undefined {
//     return ships.find(e => e.id == id);
// }

// export function removeShip(ship: Ship) {
//     document.getElementById(ship.id)?.remove();
//     ships.splice(ships.findIndex(s => s == ship), 1)
// }
