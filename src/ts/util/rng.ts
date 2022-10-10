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
 * Picks a random from an array.
 * @param array any[]
 * @returns any
 */
//
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
    let alias = "";

    if (Math.random() < 0.3) {
       alias = ` '${pickFromArray(shipNames)}'`
    }

    // ${alias} generates a space at the beginning of the string
    return `${firstName}${alias} ${lastName}`
}
