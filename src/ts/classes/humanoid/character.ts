import { Health } from './health';
import { Skills } from './skills';

/**
 * A character containing skills, health, location and others.
 */
export class Character {
    public readonly name: string = "Carmen Miranda";
    public readonly title: string = "ghost";
    public location: string = "cargobay";
    public health: Health;
    public skills: Skills;

    constructor (name: string, title: string, location: string, health: Health, skills: Skills) {
        this.name = name;
        this.title = title;
        this.location = location;
        this.skills = skills;
        this.health = health;
    }

    get fullname() {
        return `${this.name}, ${this.title}`
    }

    public ui(): Node {
        const div = document.createElement("div");
        const name = document.createElement("h2");
        name.textContent = this.fullname;
        div.appendChild(name);
        div.classList.add("item");
        div.style.height = "150px";
        div.style.maxWidth = "250px";

        const status = document.createElement("p");
        status.textContent = `${this.name} is located at ${this.location} and is ${this.health.getHealthPercentage() * 100}% healthy`;
        div.appendChild(status);

        return div;
    }
}