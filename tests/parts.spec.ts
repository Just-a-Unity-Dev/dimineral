import { describe, expect, it } from 'vitest';
import { Ship } from '../src/ts/addons/ship/ship';
import { createShip } from './ship.spec';

describe("parts", () => {
    it("hull is correct", () => {
        const ship: Ship = createShip();
        expect(ship.getPartById("life")?.totalHp).toBe(75);
    })
})
