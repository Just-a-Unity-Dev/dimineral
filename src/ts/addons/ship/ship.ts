import { generateString } from '../../util/rng';
import { Character } from '../../addons/humanoid/character';
import { Part } from './part';
import { addS, appendChilds } from '../../util/ui';
import { addStatus, findStatus, Status } from '../status/status';
import { Cargo, Item } from '../cargo/cargo';

/**
 * A ship, consisting of parts and crew making sure it stays afloat.
 */
export class Ship {
    public readonly name: string = "MasterShip 10000"
    public readonly parts: Part[] = [];
    public readonly crew: Character[] = [];
    public readonly id: string = "";
    public cargobay: Cargo;
    public visible = true;
    public money = 250;
    public incidents = 0;

    constructor(name: string, parts: Part[], crew: Character[], id?: string | undefined, items?: Item[]) {
        if (id == "" || id == undefined) {
            id = generateString(15);
        }
        this.name = name;
        this.id = id;
        this.parts = parts;
        this.crew = crew;
        this.cargobay = new Cargo(<Item[]>items);
    }

    /**
     * Add's a part to the Ship's part list
     * @param part 
     */
    public addPart(part: Part) {
        this.parts.push(part);
    }

    /**
     * Using a Part ID, removes a part from the ship's part list
     * @param id string
     */
    public removePart(id: string) {
        const partIndex: number = this.parts.findIndex(e => e.id == id);
        // const part: Part = this.parts[partIndex];
        this.parts.splice(partIndex, 1);
    }

    /**
     * Removes a crewmember from the crew list.
     * @param name string
     */
    public removeCrew(name: string) {
        this.crew.splice(this.parts.findIndex(e => e.name == name), 1);
    }

    /**
     * Add's a crewmember to the crew list.
     * @param crew Character
     */
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
     * Returns an array of Characters[] in a room
     * @param id string
     * @returns Character[]
     */
    public getCrewInRoom(id: string): Character[] {
        const array: Character[] = [];
        const part = <Part>this.getPartById(id);
        if (part == undefined) return array;
        this.crew.forEach(member => {
            if (member.location == part?.id) {
                array.push(member);
            }
        })
        return array;
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
    public totalHull(verbose = false): number[] | string {
        let hp = 0;
        let totalMaxHp = 0;
        this.parts.forEach(part => {
            hp += part.hull;
            totalMaxHp += part.totalMaxHp;
        });
        if (verbose) {
            return `${hp} hull (${Math.round((hp / totalMaxHp) * 100)}%)`
        }
        return [hp, totalMaxHp];
    }

    public hasPart(part: string) {
        if (this.parts.find(p => p.id == part) != null) {
            if (!this.parts.find(p => p.id == part)?.disabled) {
                return true;
            }
        }
        return false;
    }

    public partManned(part: string) {
        if (this.hasPart(part)) {
            if (this.getPartById(part) != null) {
                return this.getCrewInRoom(part).length > 0;
            }
        }
        return false;
    }

    /**
     * Updates the initial UI generated by `ui()`
     */
    public tick() {
        // update crew
        const crewLabel: Status|null = findStatus("Crewmembers");
        if (crewLabel != null) {
            crewLabel.value = `You have ${this.crew.length} ${addS(this.crew.length, "crewmember")} aboard this ship.`;

        }
        this.crew.forEach(member => {
            member.tick();
        });
        
        // update parts
        const partLabel: Status|null = findStatus("Ship Hull");
        if (partLabel != null) {
            partLabel.value = <string>this.totalHull(true);
        }

        this.parts.forEach(part => {
            part.tick();
        });

        const cargoDiv: HTMLDivElement|null = <HTMLDivElement>document.getElementById(`${this.id}-cargo`);
        if (cargoDiv != null) this.icargoloop(cargoDiv);

        // update location
        const locationLabel: Status|null = findStatus("Dock");
        if (locationLabel != null) locationLabel.value = <string>this.status;

        const pilotingLabel = <Status>findStatus("Piloting");
        if (pilotingLabel != null) pilotingLabel.value = this.pilotingControls;

        const fuelLabel = findStatus("Fuel");
        if (fuelLabel != null) fuelLabel.value = this.incidents;

        const moneyLabel = findStatus("Money");
        if (moneyLabel != null) moneyLabel.value = <string>this.money.toLocaleString() + "$";
    }

    get pilotingControls() {
        return this.partManned("bridge");
    }

    /**
    * obsolete
    */
    get status() {
        return "deprecated, you shouldn't see this";
    }

    // loop
    icargoloop(rdiv: HTMLDivElement) {
        rdiv.replaceChildren();

        const items = this.cargobay.getAllItems();
        const keys = Object.keys(items);
        
        keys.forEach(key => {
            const div = document.createElement("div");
            div.id = `${this.id}-cargo-${key}`;
            div.classList.add("item");

            // todo fix on hover transition
            div.style.transition = "none";

            const value = items[key];

            const header = document.createElement("h2");
            const strong = document.createElement("strong");
            const label = document.createElement("p");
            header.textContent = value[0];
            label.id = `${this.id}-${this.name}-${key}`;
            label.textContent = `You have ${value[1]} ${value[0]}`;

            strong?.appendChild(label);
            appendChilds(div, [header, strong])
            rdiv.appendChild(div);
        });
    }

    /**
     * Generate the initial UI
     * @returns Node
     */
    public init(): Node {
        // The div that holds it all
        const div = document.createElement("div");
        div.id = this.id;
        div.classList.add("item");
        div.classList.add("xl");

        // Basic data
        const header = document.createElement("h2");
        header.textContent = this.name;
        div.appendChild(header);

        div.appendChild(document.createElement("br"));

        const crewUi = () => {
            // Crew
            const crewDetails = document.createElement("details");
            div.appendChild(crewDetails)
    
            const crewLabel = document.createElement("summary");
            crewLabel.textContent = "Crew";
            crewDetails.appendChild(crewLabel);
    
            const crew = document.createElement("div");
            crew.classList.add("items");
            crew.id = `${this.id}-crew`
            crewDetails.appendChild(crew);
    
            this.crew.forEach(member => {
                crew.appendChild(member.init());
            });
        }

        const partUi = () => {
            // Parts
            const partDetails = document.createElement("details");
            div.appendChild(partDetails)
    
            const partLabel = document.createElement("summary");
            partLabel.textContent = "Rooms";
            partDetails.appendChild(partLabel);
    
            const parts = document.createElement("div");
            parts.classList.add("items");
            parts.id = `${this.id}-parts`
            partDetails.appendChild(parts);
    
            this.parts.forEach(part => {
                parts.appendChild(part.init());
            });
        }

        const cargoUi = () => {
            // Cargo
            const cargoDetails = document.createElement("details");
            div.appendChild(cargoDetails)

            const cargoLabel = document.createElement("summary");
            cargoLabel.textContent = "Cargo";
            cargoDetails.appendChild(cargoLabel);

            const cargo = document.createElement("div");
            cargo.classList.add("items");
            cargo.id = `${this.id}-cargo`
            cargoDetails.appendChild(cargo);

            this.icargoloop(cargo);
        }

        crewUi();
        partUi();
        cargoUi();

        addStatus(new Status("Hull", <string>this.totalHull(true)));
        addStatus(new Status("Crew", `You have ${this.crew.length} ${addS(this.crew.length, "crewmember")} on this colony.`));
        addStatus(new Status("Incidents", `You have had ${this.incidents} ${addS(this.incidents, "incident")} on this colony.`));
        addStatus(new Status("Money", <string>this.money.toLocaleString() + "$"));
        return div;
    }
}