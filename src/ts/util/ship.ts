import { generateString } from './rng';
import shipNames from "../json/shipNames.json";

export function generateName(): string {
    let prefix = generateString(2).toUpperCase();
    let id = Math.floor(Math.random() * 100);
    let name = shipNames[Math.floor(Math.random() * shipNames.length)]

    return `${prefix}-${id} ${name}`
}
