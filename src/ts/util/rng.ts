import { first, last } from "../../json/names.json";
import shipNames from "../../json/shipNames.json";
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Returns a randomly generated string, recommended length is 50. Good for generating ID's.
 * @param length number
 * @returns string
 */
export function generateString(length: number): string {
    let result = "";
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

/**
 * The percentage of something happening. Under NO circumstance should this affect gameplay. (A good example of this function being used is generateShipName)
 * @remarks Basically just the BYOND proc.
 * @param percent number
 */
export function prob(percent: number): boolean {
    const percentage: number = Math.random();
    return (percentage * 100) < percent;
}

/**
 * Picks a random from an array.
 * @param array any[]
 * @returns any
 */
// eslint-disable-next-line
export function pickFromArray(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)]
}

/**
 * Returns a random name
 * @returns string
 */
export function generateName(): string {
    const firstName = pickFromArray(first);
    const lastName = pickFromArray(last);
    const output: string[] = [];

    output.push(firstName);
    if (prob(30)) {
       output.push(`'${pickFromArray(shipNames)}'`);
    }
    output.push(lastName);

    return output.join(" ");
}

/**
 * Generates a random location name
 * @returns string
 */
export function generateLocationName(): string {
    const output: string[] = []
    if (prob(30)) {
        output.push(pickFromArray(first) + "'s")
    }
    output.push(pickFromArray(shipNames))
    return output.join(" ");
}

export function next(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generates a random ship name
 * @returns string
 */
export function generateShipName(): string {
    const prefix = generateString(2).toUpperCase();
    const id = Math.floor(Math.random() * 100);
    const output: string[] = [];
    output.push(`${prefix}-${id}`)
    if (prob(15)) {
        output.push("The");
    }
    if (prob(30)) {
        output.push(pickFromArray(shipNames) + "'s");
    } else {
        output.push(pickFromArray(shipNames));
    }
    output.push(pickFromArray(shipNames));

    return output.join(" ");
}
