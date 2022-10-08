import { Health } from './health';
import { Skills } from './skills';

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
}