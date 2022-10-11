import { getShipById, removeShip } from "./ships";
import { generateString } from "../../util/rng";
import { selected, setSelected } from "../selected";

/**
 * A part in a `Ship`
 */
export class Part {
    public readonly name: string = ""
    public readonly id: string = ""
    public readonly shipId: string = "";
    public supply = 0;
    public consumed = 0;
    private readonly maxHull: number = 0
    private readonly maxShield: number = 0;
    private readonly the: boolean = false;
    private health = 0;
    private shield = 0;
    public readonly uid: string = generateString(8);

    constructor (
        name: string,
        id: string,
        health: number,
        maxHull: number,
        shield: number,
        shipId: string,
        the: boolean,
        power: number
    ){
        this.name = name;
        this.id = id;
        this.health = health;
        this.maxHull = maxHull;
        this.maxShield = shield;
        this.shield = shield;
        this.shipId = shipId;
        this.the = the;

        // If it's negative, then make it a consumer
        if (power > 0) {
            this.supply = power;
        } else {
            this.consumed = (power * -1);
        }
    }
    
    /**
     * Returns the name of the part
     */
    public get getName() {
        return `${this.the ? "the " : " "}${this.name}`
    }

    /**
     * Destroys the Part
     */
    public destroy() {
        const ship = getShipById(this.shipId);
        if (ship  == undefined) return;

        document.getElementById(`${this.shipId}-${this.id}`)?.remove();
        if ((ship.parts.length - 1) <= 0) {
            removeShip(ship);
        }
        ship.removePart(this.id);

    }

    /**
     * Deals an amount of damage to shields/hull.
     * @param damage number
     */
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

    /**
     * Returns the total HP
     */
    get totalHp() {
        return this.health + this.shield;
    }

    /**
     * Returns the total max HP
     */
    get totalMaxHp() {
        return this.maxHull + this.maxShield;
    }
    
    /**
     * Returns the percentage between current and total HP
     */
    get partHpPercentage() {
        return this.totalHp / this.totalMaxHp;
    }

    /**
     * Returns the total health (including shield)
     * and if you want it to be verbose you can mark it as such.
     * @param verbose boolean
     * @returns number | string
    */
    public totalHealth(verbose = false): number | string {
        const total: number = this.totalHp;
        if (verbose) {
            return `${this.health} hull + ${this.shield} shield = ${total} total (${Math.round(this.partHpPercentage * 100)}%)`;
        }
        return total;
    }

    /**
     * Updates the UI
     * @param id string
     */
    public tick(id: string) {
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
    public init(id: string): Node {
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
        // div.appendChild(damage);

        getShipById(this.shipId)?.power.addConsumer(this.id + "-" + this.uid, this.consumed);
        getShipById(this.shipId)?.power.addSupplier(this.id + "-" + this.uid, this.supply);
        
        return div;
    }
}
