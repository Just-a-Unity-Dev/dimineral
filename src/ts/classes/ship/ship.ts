import { Character } from '../humanoid/character';
import { Part } from './part';

/**
 * A ship, consisting of parts and crew making sure it stays afloat.
 */
export class Ship {
    public readonly parts: Part[] = [];
    public readonly crew: Character[] = [];

    constructor(parts: Part[], crew: Character[]) {
        this.parts = parts;
        this.crew = crew;
    }

    /**
     * Add's a part to the Ship's part list
     * @param part 
     */
    public addPart(part: Part) {
        this.parts.push(part);
    }

    /**
     * Returns a part by it's defined ID
     * @param id 
     * @returns Part | undefined | null
     */
    public getPartById(id: string): Part | undefined | null {
        return this.parts.find(part => part.id == id);
    }

    /**
     * Returns a crewmember by it's name
     * @param name 
     * @returns Character | undefined | null
     */
    public getCrewByName(name: string): Character | undefined | null {
        return this.crew.find(member => member.name == name);
    }

    /**
     * Returns the totalHull in an array or a string if you want it verbose
     * @param verbose boolean
     * @returns number[] | string
     * @example
     * let part: Part = new Part("foo", "bar", 20, 20, 10);
     * let ship: Ship = new Ship([part],[]);
     * // returns [20, 10, 30]
     * // hull, shield, total
     * console.log(ship.totalHull())
     */
    public totalHull(this: Ship, verbose: boolean = false): number[] | string {
        let hp = 0;
        let shield = 0;
        this.parts.forEach(part => {
            hp += part.hull;
            shield += part.shieldHp;
        });
        let total = hp + shield;
        if (verbose) {
            return `${hp} hull + ${shield} shield = ${total} total`
        }
        return [hp, shield, total];
    }
}