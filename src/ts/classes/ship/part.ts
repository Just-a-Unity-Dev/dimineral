/**
 * A part in a `Ship`
 */
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
    
    /**
     * Returns the hull health of this part
     * If you need total health, use `totalHealth`
     * @returns number
     */
    get hull() {
        return this.health;
    }

    /**
     * Returns the shield health of this part
     * If you need total health, use `totalHealth`
     * @returns number
     */
    get shieldHp() {
        return this.shield;
    }

    /**
     * Returns the total health (including shield)
     * and if you want it to be verbose you can mark it as such.
     * @param verbose boolean
     * @returns number | string
    */
    public totalHealth(verbose: boolean = false): number | string {
        let total: number = this.health + this.shield;
        if (verbose) {
            return `${this.health} hull + ${this.shield} shield = ${total} total`;
        }
        return total;
    }

    public updateUi(id: string) {
        const data = document.getElementById(`${id}-${this.id}-data`);
        if (data == undefined) return;
        data.textContent = <string>this.totalHealth(true);
    }

    /**
     * Initialize UI
     * @param id string
     * @returns Node
     */
    public ui(id: string): Node {
        // Main div
        const div = document.createElement("div");
        div.classList.add("item");

        // Data
        const label = document.createElement("h2");
        label.textContent = this.name;
        div.appendChild(label);

        const data = document.createElement("p");
        data.id = `${id}-${this.id}-data`;
        data.textContent = <string>this.totalHealth(true);
        div.appendChild(data);

        return div;
    }
}
