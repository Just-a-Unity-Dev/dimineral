export class Power {
    public readonly suppliers: {[id: string]: number} = {};
    public readonly consumers: {[id: string]: number} = {};

    public addSupplier(id: string, value: number) {
        this.suppliers[id] = value;
    }
    
    public addConsumer(id: string, value: number) {
        this.consumers[id] = value;
    }

    get power() {
        const sup = Object.keys(this.suppliers);
        const con = Object.keys(this.consumers);
        let supply: number = 0;
        let consumed: number = 0;

        sup.forEach(supplier => {
            supply += this.suppliers[supplier]
        });
        con.forEach(consumer => {
            consumed += this.consumers[consumer]
        });

        return supply - consumed;
    }
}