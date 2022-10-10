import { generateString, pickFromArray } from './rng';
import shipNames from "../../json/shipNames.json";

/**
 * Generates a random ship name
 * @returns string
 */
export function generateShipName(): string {
    const prefix = generateString(2).toUpperCase();
    const id = Math.floor(Math.random() * 100);
    const name = pickFromArray(shipNames);

    return `${prefix}-${id} ${name}`
}
