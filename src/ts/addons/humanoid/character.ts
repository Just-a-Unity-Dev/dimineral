import { selected, setSelected } from "../../addons/selected";
import { capitalizeFirstLetter } from "../../util/characters";
import { addS } from "../../util/ui";
import { getShipById, removeShip } from '../ship/ship';
import { Health } from './health';
import { Skills } from './skills';

/**
 * A character containing skills, health, location and others.
 */
export class Character {
    public readonly name: string = "Carmen Miranda";
    public readonly title: string = "ghost";
    public readonly shipId: string = "";
    public location = "cargobay";
    public health: Health;
    public skills: Skills;

    constructor (
        name: string, 
        title: string, 
        location: string, 
        health: Health, 
        skills: Skills,
        shipId: string,
    ) {
        this.name = name;
        this.title = title;
        this.location = location;
        this.skills = skills;
        this.health = health;
        this.shipId = shipId;
    }

    /**
     * Returns the full name, along with title
     */
    get fullName() {
        return `${this.name}, ${this.title}`
    }

    /**
     * Destroys the Character.
     * @returns null
     */
    public destroy() {
        setSelected("");
        const ship = getShipById(this.shipId);
        if (ship == undefined) return;

        document.getElementById(`${this.shipId}-${this.name}`)?.remove();
        if ((ship.crew.length - 1) <= 0) {
            removeShip(ship);
        }
        ship.removeCrew(this.name);
    }

    /**
     * Sets the location of a character
     * @param id string
     */
    public setLocation(id: string) {
        this.location = id;
    }

    /**
     * Updates the UI
     * @param id string
     * @returns null
     */
    public tick(id: string) {
        // this has to do be done first before the rest of the UI because it might break stuff
        // either a CRITICAL error or they were in a part when it was destroyed
        // regardless, they need to be removed.
        if (getShipById(this.shipId)?.getPartById(this.location)?.getName == undefined) {
            // probably shouldn't do this in UI update
            // but it technically updates UI so...
            this.destroy();

            return;
        }
        const status: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(`${id}-${this.name}-status`);
        status.textContent = `${this.name} is located at ${getShipById(this.shipId)?.getPartById(this.location)?.getName} and is ${this.health.getHealthPercentage() * 100}% healthy`;
        
        // skills
        const keys: string[] = Object.keys(this.skills);        
        keys.forEach((key: string) => {
            const label = document.getElementById(`${this.shipId}-${this.name}-${key}`);
            if (label != null) label.textContent = `${capitalizeFirstLetter(key)}: ${this.skills[key]} ${addS(this.skills[key], "point")}`;
        });

        const select: HTMLButtonElement = <HTMLButtonElement>document.getElementById(`${id}-${this.name}-select`);
        select.disabled = selected != "";
        select.textContent = (selected != "") ? "Selected" : "Select";
        switch (selected) {
            case "":
                select.textContent = "Select";
                break;
            case this.name:
                select.textContent = "Selected";
                break;
            default:
                select.textContent = "Disabled";
        }
    }

    /**
     * Initializes the UI
     * @param id string
     * @returns Node
     */
    public init(id: string): Node {
        const div = document.createElement("div");
        const name = document.createElement("h3");
        name.textContent = this.fullName;
        div.appendChild(name);
        div.classList.add("item");
        div.style.height = "150px";
        div.style.maxWidth = "250px";
        div.id = `${id}-${this.name}`

        const status = document.createElement("p");
        status.id = `${id}-${this.name}-status`
        div.appendChild(status);

        const button = document.createElement("button");
        button.textContent = "Select";
        button.id = `${id}-${this.name}-select`
        div.appendChild(button);

        button.addEventListener("click", () => {
            // set selected
            setSelected(this.name);
        });

        // skills
        const keys: string[] = Object.keys(this.skills);
        
        keys.forEach((key: string) => {
            const strong = document.createElement("strong");
            const label = document.createElement("p");
            label.id = `${this.shipId}-${this.name}-${key}`;
            label.textContent = `${capitalizeFirstLetter(key)}: ${this.skills[key]} ${addS(this.skills[key], "point")}`;

            strong?.appendChild(label);
            div?.appendChild(strong);
        });

        return div;
    }
}