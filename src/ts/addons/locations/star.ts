import { quickCreate } from "../../util/ui";
import { Planet } from "./planet";
export const stars: Star[] = [];

export function addStar(star: Star) {
    stars.push(star);
}

export class Star {
    public readonly name: string = "Starscream";
    public planets: Planet[] = [];
    // TODO: Add diplomacy owners and etc when its coded

    constructor (name: string, planets: Planet[]) {
        this.name = name;
        this.planets = planets;
    }

    public init(): Node {
        const div = document.createElement("div");
        const details = quickCreate("details");
        const summary = quickCreate("summary", "Planets");
        div.appendChild(quickCreate("h2", this.name))
        div.appendChild(details);
        details.appendChild(summary);
        div.classList.add("item");
        div.classList.add("medium");

        this.planets.forEach((planet: Planet) => {
            details.appendChild(planet.init());
        });

        return div;
    }
}