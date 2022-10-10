export class Power {
    public readonly suppliers: {[id: string]: number} = {};
    public readonly consumers: {[id: string]: number} = {};

    public addSupplier(id: string, value: number) {
        this.suppliers[id] = value;
    }
    
    public addConsumer(id: string, value: number) {
        this.consumers[id] = value;
    }

    public removeConsumer(id: string) {
        delete this.consumers[id]
    }

    public removeSupplier(id: string) {
        delete this.suppliers[id]
    }

    get supply() {
        const sup = Object.keys(this.suppliers);
        let supply: number = 0;

        sup.forEach(supplier => {
            supply += this.suppliers[supplier];
        });

        return sup;
    }

    get power() {
        let supply: number = 0;
        let consumed: number = 0;

        for (const [_key, value] of Object.entries(this.suppliers)) {
            supply += value;
        }
        for (const [_key, value] of Object.entries(this.consumers)) {
            consumed += value;
        }

        return supply - consumed;
    }
}