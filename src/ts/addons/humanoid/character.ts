import { selected, setSelected } from "../../addons/selected";
import { capitalizeFirstLetter } from "../../util/characters";
import { addS, quickCreate } from "../../util/ui";
import { mainShip } from "../ship/ships";
import { ctick } from "../ticker/tick";
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
    public disabled: boolean;

    constructor (
        name: string, 
        title: string, 
        location: string, 
        health: Health, 
        skills: Skills,
        shipId: string,
        disabled?: boolean
    ) {
        this.name = name;
        this.title = title;
        this.location = location;
        this.skills = skills;
        this.health = health;
        this.shipId = shipId;
        this.disabled = <boolean>disabled;
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
        const ship = mainShip;
        if (ship == undefined) return;

        document.getElementById(`${this.shipId}-${this.name}`)?.remove();
        // if ((ship.crew.length - 1) <= 0) {
        //     removeShip(ship);
        // }
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
    public tick() {
        // this has to do be done first before the rest of the UI because it might break stuff
        // either a CRITICAL error or they were in a part when it was destroyed
        // regardless, they need to be removed.
        if (mainShip.getPartById(this.location)?.getName == undefined) {
            // probably shouldn't do this in UI update
            // but it technically updates UI so...
            this.destroy();

            return;
        }
        const status: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(`${this.shipId}-${this.name}-status`);
        status.textContent = `${this.name} is located at ${mainShip.getPartById(this.location)?.getName} and is ${Math.round(this.health.getHealthPercentage() * 100)}% healthy`;
        
        // skills
        const keys: string[] = Object.keys(this.skills);        
        keys.forEach((key: string) => {
            const label = document.getElementById(`${this.shipId}-${this.name}-${key}`);
            if (label != null) label.textContent = `${capitalizeFirstLetter(key)}: ${this.skills[key]} ${addS(this.skills[key], "point")}`;
        });

        // 1 second
        if (ctick % 100) {
            if (this.location == "medbay") {
                if (this.health.getHealthPercentage() < 1) {
                    this.health.dealDamage({
                        "physical": -1,
                        "temperature": -1,
                        "chemical": -1,
                        "genetic": 0,
                        "psychological": 0
                    });
                }
            }
        }

        const select: HTMLButtonElement = <HTMLButtonElement>document.getElementById(`${this.shipId}-${this.name}-select`);
        select.disabled = selected != "" || this.disabled;
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
     * @returns Node
     */
    public init(): Node {
        const div = <HTMLDivElement>quickCreate("div");
        const name = <HTMLHeadingElement>quickCreate("h3");
        name.textContent = this.fullName;
        div.appendChild(name);
        div.classList.add("item");
        div.style.height = "150px";
        div.style.maxWidth = "250px";
        div.id = `${this.shipId}-${this.name}`

        const status = <HTMLParagraphElement>quickCreate("p");
        status.id = `${this.shipId}-${this.name}-status`
        div.appendChild(status);

        const button = <HTMLButtonElement>quickCreate("button", "Select");
        button.id = `${this.shipId}-${this.name}-select`
        div.appendChild(button);

        button.addEventListener("click", () => {
            // set selected
            setSelected(this.name);
        });

        // skills
        div.appendChild(quickCreate("h3", "Skills"));
        const keys: string[] = Object.keys(this.skills);
        
        keys.forEach((key: string) => {
            const strong = quickCreate("strong");
            const label = <HTMLParagraphElement>quickCreate("p");
            label.id = `${this.shipId}-${this.name}-${key}`;
            label.textContent = `${capitalizeFirstLetter(key)}: ${this.skills[key]} ${addS(this.skills[key], "point")}`;

            strong?.appendChild(label);
            div?.appendChild(strong);
        });

        return div;
    }
}