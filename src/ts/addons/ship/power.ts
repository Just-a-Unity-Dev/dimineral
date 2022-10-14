export class Power {
    public readonly suppliers: {[id: string]: number} = {};
    public readonly consumers: {[id: string]: number} = {};

    /**
     * Adds a supplier
     * @param id string
     * @param value number
     */
    public addSupplier(id: string, value: number) {
        this.suppliers[id] = value;
    }
    
    /**
     * Adds a consumer
     * @param id string
     * @param value number
     */
    public addConsumer(id: string, value: number) {
        this.consumers[id] = value;
    }

    /**
     * Removes a consumer
     * @param id string
     * @param value number
     */
    public removeConsumer(id: string) {
        delete this.consumers[id];
    }

    /**
     * Removes a supplier
     * @param id string
     * @param value number
     */
    public removeSupplier(id: string) {
        delete this.suppliers[id];
    }

    /**
     * Returns the total supply
     */
    get supply() {
        const sup = Object.keys(this.suppliers);
        let supply = 0;

        sup.forEach(supplier => {
            supply += this.suppliers[supplier];
        });

        return supply;
    }

    /**
     * Returns the total power (suppliers - consumers)
     */
    get power() {
        let supply = 0;
        let consumed = 0;

    // eslint-disable-next-line
        for (const [_key, value] of Object.entries(this.suppliers)) {
            supply += value;
        }

    // eslint-disable-next-line
        for (const [_key, value] of Object.entries(this.consumers)) {
            consumed += value;
        }

        return supply - consumed;
    }
}