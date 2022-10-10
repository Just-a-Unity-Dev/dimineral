import { generateString } from "../../util/rng";
import { quickCreate } from "../../util/ui";

export class Planet {
    // BANNED FROM ARGO EVERYOONNNEE
    public readonly name: string = "Argo";
    public readonly id: string = generateString(10);

    constructor (name: string) {
        this.name = name;
    }

    public init(): Node {
        const div = document.createElement("div");
        div.appendChild(quickCreate("h3", this.name));
        div.classList.add("item");
        div.classList.add("small");
        

        return div;
    }
}