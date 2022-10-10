import { generateString } from '../../util/rng';
import { Character } from '../../addons/humanoid/character';
import { Part } from './part';

/**
 * A ship, consisting of parts and crew making sure it stays afloat.
 */
export class Ship {
    public readonly name: string = "MasterShip 10000"
    public readonly parts: Part[] = [];
    public readonly crew: Character[] = [];
    public readonly id: string = "";
    public visible: boolean = true;

    constructor(name: string, parts: Part[], crew: Character[], id?: string | undefined) {
        if (id == "" || id == undefined) {
            id = generateString(15);
        }
        this.name = name;
        this.id = id;
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

    public removePart(id: string) {
        this.parts.splice(this.parts.findIndex(e => e.id == id), 1);
    }

    public removeCrew(name: string) {
        this.crew.splice(this.parts.findIndex(e => e.name == name), 1);
    }

    public addCrew(crew: Character) {
        this.crew.push(crew);
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
        let totalMaxHp = 0;
        this.parts.forEach(part => {
            hp += part.hull;
            shield += part.shieldHp;
            totalMaxHp += part.totalMaxHp;
        });
        let total = hp + shield;
        if (verbose) {
            return `${hp} hull + ${shield} shield = ${total} total (${Math.round((total / totalMaxHp) * 100)}%)`
        }
        return [hp, shield, total, totalMaxHp];
    }

    /**
     * Updates the initial UI generated by `ui()`
     */
    public updateUi() {
        // update crew
        const crewLabel: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(`${this.id}-crewlabel`);
        if (crewLabel != null) {
            crewLabel.textContent = `You have ${this.crew.length} crew aboard this ship.`;

            this.crew.forEach(member => {
                member.updateUi(this.id);
            });
        }

        // update parts
        const partLabel: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(`${this.id}-partlabel`);
        if (partLabel != null) {
            partLabel.textContent = <string>this.totalHull(true);

            this.parts.forEach(part => {
                part.updateUi(this.id);
            });
        }
    }

    /**
     * Generate the initial UI
     * @returns Node
     */
    public ui(): Node {
        // The div that holds it all
        const div = document.createElement("div");
        div.id = this.id;
        div.classList.add("item");
        div.style.maxWidth = "650px";
        div.style.minWidth = "200px";
        div.style.height = "300px";

        // Basic data
        const header = document.createElement("h2");
        header.textContent = this.name;
        div.appendChild(header);

        const id = document.createElement("em");
        id.textContent = "ID: " + this.id;
        div.appendChild(id);

        div.appendChild(document.createElement("br"));

        // Crew
        const crewDetails = document.createElement("details");
        div.appendChild(crewDetails)

        const crewLabel = document.createElement("summary");
        crewLabel.textContent = `You have ${this.crew.length} crewmembers above this ship.`
        crewLabel.id = `${this.id}-crewlabel`
        crewDetails.appendChild(crewLabel);

        const crew = document.createElement("div");
        crew.classList.add("items");
        crew.id = `${this.id}-crew`
        crewDetails.appendChild(crew);

        this.crew.forEach(member => {
            crew.appendChild(member.ui(this.id));
        });

        // Parts
        const partDetails = document.createElement("details");
        div.appendChild(partDetails)

        const partLabel = document.createElement("summary");
        partLabel.textContent = <string>this.totalHull(true);
        partLabel.id = `${this.id}-partlabel`
        partDetails.appendChild(partLabel);

        const parts = document.createElement("div");
        parts.classList.add("items");
        parts.id = `${this.id}-parts`
        partDetails.appendChild(parts);

        this.parts.forEach(part => {
            parts.appendChild(part.ui(this.id));
        });

        return div;
    }
}