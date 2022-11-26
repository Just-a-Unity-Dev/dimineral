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