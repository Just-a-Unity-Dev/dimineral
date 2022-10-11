import { generateString } from "../../util/rng";
import { quickCreate } from "../../util/ui";
import { ships } from "../ship/ships";
import { Star, stars } from "./star";

/**
 * A landable location
 */
export class Planet {
    // BANNED FROM ARGO EVERYOONNNEE
    public readonly name: string = "Argo";
    public readonly id: string = generateString(10);
    public readonly sid: string;
    private fly: HTMLButtonElement = <HTMLButtonElement>quickCreate("button", "Land");

    constructor (name: string, sid: string) {
        this.name = name;
        this.sid = sid;
    }

    public tick() {
        this.fly.disabled = !ships[0].canFly(
            <Star>stars.find(
                star => star.planets.find(
                    planet => planet == this
                )
            )
        )
    }

    /**
     * Checks whether the main ship is able to fly to this planet
     */
    get canFly() {
        return ships[0].location == stars.find(star => star.id == this.sid);
    }

    /**
     * Initializes the planet
     * @returns Node
     */
    public init(): Node {
        const div = document.createElement("div");
        div.appendChild(quickCreate("h3", this.name));
        div.classList.add("item");
        div.classList.add("xs");

        this.fly.addEventListener("click", () => {
            if (this.canFly) ships[0].fly(this);
        });
        div.appendChild(this.fly);

        return div;
    }
}