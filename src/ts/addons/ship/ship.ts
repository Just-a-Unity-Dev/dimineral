import { generateString } from '../../util/rng';
import { Character } from '../../addons/humanoid/character';
import { Part } from './part';
import { Power } from './power';
import { addS } from '../../util/ui';
import { addStatus, findStatus, Status } from '../status/status';
import { Planet } from '../locations/planet';
import { Star, stars } from '../locations/star';
import { fuelDiff } from '../../consts';
import { play } from '../../util/audio';
import { app } from '../../main';

/**
 * A ship, consisting of parts and crew making sure it stays afloat.
 */
export class Ship {
    public readonly name: string = "MasterShip 10000"
    public readonly parts: Part[] = [];
    public readonly crew: Character[] = [];
    public readonly id: string = "";
    public power: Power = new Power();
    public location: Star | Planet | null = null;
    public visible = true;
    public money = 250;
    public fuel = 30;

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
     * Checks if the ship's power is bigger than zero.
     * @returns boolean
     */
    get powered () {
        return this.power.power > 0;
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
        const part: Part = this.parts[partIndex];
        this.power.removeConsumer(part.id + "-" + part.uid);
        this.power.removeSupplier(part.id + "-" + part.uid);
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
        let shield = 0;
        let totalMaxHp = 0;
        this.parts.forEach(part => {
            hp += part.hull;
            shield += part.shieldHp;
            totalMaxHp += part.totalMaxHp;
        });
        const total = hp + shield;
        if (verbose) {
            return `${hp} hull + ${shield} shield = ${total} total (${Math.round((total / totalMaxHp) * 100)}%)`
        }
        return [hp, shield, total, totalMaxHp];
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
     * Return whether you are able to fly to this star, if using UI use function `canFlyUi`
     * @param loc Star | Planet
     * @returns boolean
     */
    public canFly(loc: Star | Planet) {
        return ((this.pilotingControls || this.location == loc) && this.fuel > (fuelDiff - 1) && this.hasPart("bridge"))
    }

    /**
     * Returns whether if you can fly to this star, but with the piloting controls inversed.
     * @param loc Star | Planet
     * @returns boolean
     */
    public canFlyUi(loc: Star | Planet) {
        return ((!this.pilotingControls || this.location == loc) && this.fuel > (fuelDiff - 1) && this.hasPart("engine"))
    }

    /**
     * Flies to a location if it can. Use `setLocation` if you want to skip checks.
     * @param location Star | Planet
     * @returns boolean
     */
    public fly(location: Star | Planet): boolean {
        if (this.canFly(location)) {
            this.setLocation(location);
            this.fuel -= fuelDiff;
            play("sfx/warp.wav");
            if (app != null)
                app.style.opacity = '0';
            setTimeout(() => {
                if (app != null)
                    app.style.opacity = '1';
            }, 500);

            return true;
        }
        return false
    }

    /**
     * Sets the location of this ship
     * @param location Star | Planet
     */
    public setLocation(location: Star | Planet) {
        this.location = location;
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

        // update location
        const locationLabel: Status|null = findStatus("Docking Status");
        if (locationLabel != null) locationLabel.value = <string>this.status;

        const pilotingLabel = <Status>findStatus("Piloting");
        if (pilotingLabel != null) pilotingLabel.value = this.pilotingControls;

        const fuelLabel = findStatus("Fuel");
        if (fuelLabel != null) fuelLabel.value = this.fuel;

        const moneyLabel = findStatus("Money");
        if (moneyLabel != null) moneyLabel.value = <string>this.money.toLocaleString() + "$";

        const power = document.getElementById(`${this.id}-power`);
        if (power != null) power.textContent = "Usage: " + this.power.power + "mW";
    }

    get pilotingControls() {
        return this.partManned("bridge");
    }

    get status() {
        if (this.location == null) {
            return "In space";
        }
        if (this.location instanceof Planet) {
            // this is... very inpreformant especially at around 100+ planets
            // however at 20 planets (which is the max that can happen) this works
            return "Landed at planet \"" + this.location.name + "\", of star \"" + stars.find(star => star.planets.find(planet => planet == this.location))?.name +"\""
        }
        if (this.location instanceof Star) {
            return "Orbiting " + this.location.name
        }
        return "???";
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

        const power = document.createElement("em");
        power.id = `${this.id}-power`;
        div.appendChild(power);

        div.appendChild(document.createElement("br"));

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

        // Parts
        const partDetails = document.createElement("details");
        div.appendChild(partDetails)

        const partLabel = document.createElement("summary");
        partLabel.textContent = "Parts";
        partDetails.appendChild(partLabel);

        const parts = document.createElement("div");
        parts.classList.add("items");
        parts.id = `${this.id}-parts`
        partDetails.appendChild(parts);

        this.parts.forEach(part => {
            parts.appendChild(part.init());
        });

        addStatus(new Status("Hull", <string>this.totalHull(true)));
        addStatus(new Status("Crew", `You have ${this.crew.length} ${addS(this.crew.length, "crewmember")} aboard this ship.`));
        addStatus(new Status("Money", <string>this.money.toLocaleString() + "$"));
        addStatus(new Status("Dock", <string>this.status));
        addStatus(new Status("Piloting", false, ["Available", "Unavailable"]));
        addStatus(new Status("Fuel", this.fuel >= 5, ["Fueled", "Empty"]));
        return div;
    }
}