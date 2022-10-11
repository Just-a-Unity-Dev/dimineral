import { generateString } from "../../util/rng";
import { quickCreate } from "../../util/ui";
import { ships } from "../ship/ships";
import { Planet } from "./planet";
export const stars: Star[] = [];

/**
 * Add's a star to `stars`
 * @param star Star
 */
export function addStar(star: Star) {
    stars.push(star);
}

/**
 * A star system
 */
export class Star {
    public readonly name: string = "Star Scream";
    public readonly id: string = generateString(10);
    public planets: Planet[] = [];
    private fly: HTMLButtonElement = <HTMLButtonElement>quickCreate("button", "Fly to Orbit");
    // TODO: Add diplomacy owners and etc when its coded

    constructor (name: string, planets: Planet[]) {
        this.name = name;
        this.planets = planets;
    }

    /**
     * Add's a planet to this system's planet list
     * @param planet Planet
     */
    public addPlanet(planet: Planet) {
        this.planets.push(planet);
    }

    /**
     * Tick's the UI and Star
     */
    public tick() {
        this.fly.disabled = ships[0].canFlyUi(this)
        this.planets.forEach(planet => {
            planet.tick();
        });
    }

    /**
     * Initializes the Star
     * @returns Node
     */
    public init(): Node {
        const div = document.createElement("div");
        const details = quickCreate("details");
        const summary = quickCreate("summary", "Planets");
        div.appendChild(quickCreate("h2", this.name))
        div.appendChild(details);
        details.appendChild(summary);
        div.classList.add("item");
        div.classList.add("small");
        
        this.fly.id = this.id;
        this.fly.addEventListener("click", () => {
            ships[0].fly(this);
        });
        div.appendChild(this.fly);

        this.planets.forEach((planet: Planet) => {
            details.appendChild(planet.init());
        });

        return div;
    }
}