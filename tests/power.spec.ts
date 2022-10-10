import { describe, expect, it } from 'vitest';
import { Power } from "../src/ts/addons/ship/power";

describe("power", () => {
    it("adding suppliers works", () => {
        const power: Power = new Power();
        power.addSupplier("test", 20)
        expect(power.suppliers).toStrictEqual({"test": 20});
    });
    it("adding consumers works", () => {
        const power: Power = new Power();
        power.addConsumer("test", 20)
        expect(power.consumers).toStrictEqual({"test": 20});
    });
    it("total works", () => {
        const power: Power = new Power();

        power.addSupplier("life", 100);

        power.addConsumer("shields", 25);
        power.addConsumer("break", 25);
        power.addConsumer("weapons", 25);

        expect(power.power).toStrictEqual(25);
    });
})