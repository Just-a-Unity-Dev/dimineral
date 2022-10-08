export class Part {
    public readonly name: string = ""
    public readonly id: string = ""
    public readonly maxHull: number = 0
    private health: number = 0
    private shield: number = 0

    constructor (name: string, id: string, health: number, maxHull: number, shield: number){
        this.name = name;
        this.id = id;
        this.health = health;
        this.maxHull = maxHull;
        this.shield = shield;
    }
    
    get hull() {
        return this.health;
    }
    
    get shieldHp() {
        return this.shield;
    }

    totalHealth(verbose: boolean = false) {
        let total: number = this.health + this.shield;
        if (verbose) {
            return `${this.health} hull + ${this.shield} shield = ${total} total`;
        }
        return total;
    }
}
