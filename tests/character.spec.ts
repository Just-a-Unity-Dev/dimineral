import { describe, expect, it } from 'vitest';
import { Ship } from '../src/ts/classes/ship/ship';
import { createShip } from './ship.spec';

describe("characters", () => {
    it("deal damage works", () => {
        const ship: Ship = createShip();
        ship.getCrewByName("Carmen Miranda").health.dealDamage({
            "physical": 18,
            "chemical": 6,
            "genetic": 16,
            "psychological": 6,
            "temperature": 24
        });
        expect(ship.getCrewByName("Carmen Miranda").health.getTotalDamage()).toBe(70);
        expect(ship.getCrewByName("Carmen Miranda").health.getTotalHealth()).toBe(130);
        expect(ship.getCrewByName("Carmen Miranda").health.getHealthPercentage()).toStrictEqual(0.65);

    })
})
