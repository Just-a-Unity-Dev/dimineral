import { generateString } from "../../util/rng";
import { quickCreate } from "../../util/ui";
import { ships } from "../ship/ships";
import { stars } from "./star";

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
        this.fly.disabled = (!ships[0].pilotingControls || !this.canFly)
    }

    get canFly() {
        return ships[0].location == stars.find(star => star.id == this.sid);
    }

    public init(): Node {
        const div = document.createElement("div");
        div.appendChild(quickCreate("h3", this.name));
        div.classList.add("item");
        div.classList.add("small");

        this.fly.addEventListener("click", () => {
            if (this.canFly) ships[0].fly(this);
        });
        div.appendChild(this.fly);

        return div;
    }
}