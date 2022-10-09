import { generateString, pickFromArray } from './rng';
import shipNames from "../json/shipNames.json";

/**
 * Generates a random ship name
 * @returns string
 */
export function generateShipName(): string {
    let prefix = generateString(2).toUpperCase();
    let id = Math.floor(Math.random() * 100);
    let name = pickFromArray(shipNames);

    return `${prefix}-${id} ${name}`
}
