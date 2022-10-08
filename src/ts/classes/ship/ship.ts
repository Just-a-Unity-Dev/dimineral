import { Character } from '../humanoid/character';
import { Part } from './part';

export class Ship {
    public parts: Part[] = [];
    public crew: Character[] = [];

    constructor(parts: Part[], crew: Character[]) {
        this.parts = parts;
        this.crew = crew;
    }

    public addPart(part: Part) {
        this.parts.push(part);
    }

    public getPartById(id: string) {
        return this.parts.find(part => part.id == id);
    }

    public getCrewByName(name: string) {
        return this.crew.find(member => member.name == name);
    }

    public totalHull(this: Ship, verbose: boolean = false) {
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