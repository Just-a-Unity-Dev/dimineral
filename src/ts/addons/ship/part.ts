import { getShipById, removeShip } from "../../main";
import { selected, setSelected } from "../selected";

/**
 * A part in a `Ship`
 */
export class Part {
    public readonly name: string = ""
    public readonly id: string = ""
    public readonly shipId: string = "";
    private readonly maxHull: number = 0
    private readonly maxShield: number = 0;
    private readonly the: boolean = false;
    private health: number = 0
    private shield: number = 0

    constructor (
        name: string,
        id: string,
        health: number,
        maxHull: number,
        shield: number,
        shipId: string,
        the: boolean = false
    ){
        this.name = name;
        this.id = id;
        this.health = health;
        this.maxHull = maxHull;
        this.maxShield = shield;
        this.shield = shield;
        this.shipId = shipId;
        this.the = the;
    }
    
    public get getName() {
        return `${this.the ? "the " : " "}${this.name}`
    }

    /**
     * Destroys the Part
     */
    public destroy() {
        let ship = getShipById(this.shipId);
        if (ship  == undefined) return;

        document.getElementById(`${this.shipId}-${this.id}`)?.remove();
        if ((ship.parts.length - 1) <= 0) {
            removeShip(ship);
        }
        ship.removePart(this.id);

    }

    public dealDamage(damage: number) {
        if (this.shieldHp > 0) {
            this.shield -= damage;
            if (this.shield < 0) {
                this.health -= this.shield * -1
                this.shield = 0
            }
        } else {
            this.health -= damage;
        }

        if (this.health <= 0) {
            this.destroy()
        }
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

    get totalHp() {
        return this.health + this.shield;
    }

    get totalMaxHp() {
        return this.maxHull + this.maxShield;
    }
    
    get partHpPercentage() {
        return this.totalHp / this.totalMaxHp;
    }

    /**
     * Returns the total health (including shield)
     * and if you want it to be verbose you can mark it as such.
     * @param verbose boolean
     * @returns number | string
    */
    public totalHealth(verbose: boolean = false): number | string {
        let total: number = this.totalHp;
        if (verbose) {
            return `${this.health} hull + ${this.shield} shield = ${total} total (${Math.round(this.partHpPercentage * 100)}%)`;
        }
        return total;
    }

    public updateUi(id: string) {
        const data: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(`${id}-${this.id}-data`);
        if (data != undefined) data.textContent = <string>this.totalHealth(true);

        const move: HTMLButtonElement = <HTMLButtonElement>document.getElementById(`${id}-${this.id}-move`);
        if (move != undefined) move.disabled = selected == "" ? true : false;
    }

    /**
     * Initialize UI
     * @param id string
     * @returns Node
     */
    public ui(id: string): Node {
        // Main div
        const div = <HTMLDivElement>document.createElement("div");
        div.id = `${this.shipId}-${this.id}`;
        div.style.height = "125px";
        div.style.width = "250px";
        div.classList.add("item");

        // Data
        const label = document.createElement("h2");
        label.textContent = this.name;
        div.appendChild(label);

        const data = document.createElement("p");
        data.id = `${this.shipId}-${this.id}-data`;
        data.textContent = <string>this.totalHealth(true);
        div.appendChild(data);

        // move here
        const move = document.createElement("button");
        move.id = `${id}-${this.id}-move`
        move.textContent = "Move Here";
        move.disabled = true;

        move.addEventListener('click', () => {
            // change the location
            getShipById(this.shipId)?.getCrewByName(selected)?.setLocation(this.id);

            // we're done with it, we can close it now
            setSelected("");
        });
        div.appendChild(move);

        const damage = document.createElement("button");
        damage.textContent = "damage";
        damage.addEventListener("click", () => {
            this.dealDamage(10)
        });
        div.appendChild(damage);

        return div;
    }
}
