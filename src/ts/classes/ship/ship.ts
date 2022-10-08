import { Part } from './part';

export class Ship {
    parts: Part[] = []
    constructor(parts: Part[]) {
        this.parts = parts
    }

    public addPart(part: Part) {
        this.parts.push(part)
    }

    public getPartById(id: string) {
        return this.parts.find(part => part.id == id)
    }

    public totalHealth(this: Ship, verbose: boolean = false) {
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