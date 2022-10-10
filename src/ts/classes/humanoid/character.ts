import { selected, setSelected } from "../../addons/selected";
import { getShipById, ships } from '../../main';
import { Health } from './health';
import { Skills } from './skills';

/**
 * A character containing skills, health, location and others.
 */
export class Character {
    public readonly name: string = "Carmen Miranda";
    public readonly title: string = "ghost";
    public readonly shipId: string = "";
    public location: string = "cargobay";
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

    get fullName() {
        return `${this.name}, ${this.title}`
    }

    public setLocation(id: string) {
        this.location = id;
    }

    public updateUi(id: string) {
        const status: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(`${id}-crew-status`);
        status.textContent = `${this.name} is located at ${getShipById(this.shipId)?.getPartById(this.location)?.getName} and is ${this.health.getHealthPercentage() * 100}% healthy`;
    
        const select: HTMLButtonElement = <HTMLButtonElement>document.getElementById(`${id}-select`);
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

    public ui(id: string): Node {
        const div = document.createElement("div");
        const name = document.createElement("h3");
        name.textContent = this.fullName;
        div.appendChild(name);
        div.classList.add("item");
        div.style.height = "150px";
        div.style.maxWidth = "250px";

        const status = document.createElement("p");
        status.textContent = `${this.name} is located at ${getShipById(this.shipId)?.getPartById(this.location)?.getName} and is ${this.health.getHealthPercentage() * 100}% healthy`;
        status.id = `${id}-crew-status`
        div.appendChild(status);

        const button = document.createElement("button");
        button.textContent = "Select";
        button.id = `${id}-select`
        div.appendChild(button);

        button.addEventListener("click", () => {
            // set selected
            setSelected(this.name);
        });

        return div;
    }
}