export class Item {
    public readonly id: string = "CHANGE_ME";
    public readonly price: number = 5;
}

export class Cargo {
    public cargo: Item[] = [];

    constructor (cargo: Item[]) {
        this.cargo = cargo;
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