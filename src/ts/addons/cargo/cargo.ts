import { appendChilds, quickCreate } from "../../util/ui";

export class Item {
    public readonly id: string = "CHANGE_ME";
    public readonly name: string = "Debug Item (YOU SHOULDN'T BE SEEING THIS)";
    public readonly price: number = 5;
}

export class Cargo {
    public cargo: Item[] = [];

    constructor (cargo: Item[] | undefined) {
        if (cargo == undefined) {
            this.cargo = [];
        } else {
            this.cargo = cargo;
        }
    }

    /**
     * Returns all items in the cargo as an ID with the first index being their name and the second being it's quantity.
     */
    public getAllItems(): {[id: string]: [string, number]} {
        const items: {[id: string]: [string, number]} = {};

        this.cargo.forEach(item => {
            if (items[item.id] == undefined) {
                items[item.id] = ["",0];
            }
            items[item.id][1]++;
            items[item.id][0] = item.name;
        });
        
        return items;
    }

    public cargoloop(rdiv: HTMLDivElement) {
        rdiv.replaceChildren();

        if (this.cargo.length == 0) {
            rdiv.appendChild(quickCreate("em", "No ores in the cargo bay."))
            return;
        }

        const items = this.getAllItems();
        const keys = Object.keys(items);
        
        keys.forEach(key => {
            const div = document.createElement("div");
            // div.id = `${this.id}-cargo-${key}`;
            div.classList.add("item");

            // todo fix on hover transition
            div.style.transition = "none";

            const value = items[key];

            const header = document.createElement("h2");
            const strong = document.createElement("strong");
            const label = document.createElement("p");
            header.textContent = value[0];
            label.textContent = `You have ${value[1]} ${value[0]}`;

            strong?.appendChild(label);
            appendChilds(div, [header, strong])
            rdiv.appendChild(div);
        });
    }

    /**
     * Searches the internal cargo for a specific ID
     * @param id string
     */
    public getAmountOfItem(id: string): number {
        let amount = 0;
        this.cargo.forEach(item => {
            if (item.id == id) {
                amount++;
            }
        });

        return amount;
    }
}