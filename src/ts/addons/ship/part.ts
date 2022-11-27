import { generateString } from "../../util/rng";
import { selected, setSelected } from "../selected";
import { quickCreate, updateButton } from "../../util/ui";
import { mainShip } from "./ships";

/**
 * A part in a `Ship`
 */
export class Part {
    public readonly name: string = ""
    public readonly id: string = ""
    public readonly shipId: string = "";
    private readonly the: boolean = false;
    
    public supply = 0;
    public consumed = 0;
    
    public disabled = false;
    
    private readonly maxHealth: number = 0
    private health = 0;

    public readonly uid: string = generateString(8);

    constructor (
        name: string,
        id: string,
        health: number,
        shipId: string
    ){
        this.name = name;
        this.id = id;
        this.health = health;
        this.maxHealth = health;
        this.shipId = shipId;
        this.maxHealth = health;
        this.the = true;
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
        const ship = mainShip;
        if (ship  == undefined) return;

        document.getElementById(`${this.shipId}-${this.id}`)?.remove();
        // if ((ship.parts.length - 1) <= 0) {
        //     removeShip(ship);
        // }
        ship.removePart(this.id);
    }

    /**
     * Deals an amount of damage to shields/hull.
     * @param damage number
     */
    public dealDamage(damage: number) {
        this.health -= damage;

        if (this.partHpPercentage <= 0.2) {
            this.setDisabled(true);
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
     * Returns the total HP
     */
    get totalHp() {
        return this.health;
    }

    /**
     * Returns the total max HP
     */
    get totalMaxHp() {
        return this.maxHealth;
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
            return `${this.health} hull (${Math.round(this.partHpPercentage * 100)}%)`;
        }
        return total;
    }

    public heal(hull: number | undefined = undefined) {
        if (hull == undefined) this.health = this.maxHealth;
        else this.health = hull;
    }

    get isHealable() {
        let mechanical = 0;
        mainShip.getCrewInRoom(this.id).forEach(crew => {
            mechanical += crew.skills.mechanical;
        });
        return mechanical >= 4 && this.partHpPercentage != 1;
    }

    get isRepairable() {
        let electrical = 0;
        mainShip.getCrewInRoom(this.id).forEach(crew => {
            electrical += crew.skills.electrical;
        });
        return electrical >= 3 && this.disabled;
    }

    public setDisabled(value: boolean) {
        this.disabled = value;
    }

    /**
     * Updates the UI
     * @param id string
     */
    public tick() {
        const data: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(`${this.shipId}-${this.id}-data`);
        if (data != undefined) data.textContent = <string>this.totalHealth(true);

        const disabled: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(`${this.shipId}-${this.id}-disabled`);
        if (disabled != undefined) disabled.style.display = this.disabled ? "block" : "none";

        updateButton(<HTMLButtonElement>document.getElementById(`${this.shipId}-${this.id}-move`), selected == "" ? true : false, true)
        updateButton(<HTMLButtonElement>document.getElementById(`${this.shipId}-${this.id}-heal`), !this.isHealable, this.isHealable)
        updateButton(<HTMLButtonElement>document.getElementById(`${this.shipId}-${this.id}-repair`), !this.isRepairable, this.isRepairable)
    }

    /**
     * Initialize UI
     * @returns Node
     */
    public init(): Node {
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

        const disabled = document.createElement("p");
        disabled.id = `${this.shipId}-${this.id}-disabled`;
        disabled.textContent = "DISABLED";
        disabled.classList.add("error");
        div.appendChild(disabled);

        // move here
        const move = <HTMLButtonElement>quickCreate("button", "Move Here");
        move.id = `${this.shipId}-${this.id}-move`
        move.disabled = true;

        move.addEventListener('click', () => {
            // change the location
            mainShip.getCrewByName(selected)?.setLocation(this.id);

            // we're done with it, we can close it now
            setSelected("");
        });
        div.appendChild(move);

        const damage = <HTMLButtonElement>quickCreate("button", "Damage");
        damage.addEventListener("click", () => {
            this.dealDamage(10)
        });
        div.appendChild(damage);

        const heal = <HTMLButtonElement>quickCreate("button", "Repair (4+ Mechanical)");
        heal.id = `${this.shipId}-${this.id}-heal`;
        heal.addEventListener("click", () => {
            if (this.isHealable) {
                this.heal();
            }
        });
        div.appendChild(heal);

        const repair = <HTMLButtonElement>quickCreate("button", "Repair (3+ Electrical)");
        repair.id = `${this.shipId}-${this.id}-repair`;
        repair.addEventListener("click", () => {
            if (this.isRepairable) {
                this.setDisabled(false);
            }
        });
        div.appendChild(repair);

        return div;
    }
}
