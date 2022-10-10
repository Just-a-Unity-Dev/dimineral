import { describe, expect, it } from 'vitest';
import { Character } from '../src/ts/addons/humanoid/character';
import { Ship } from '../src/ts/addons/ship/ship';
import { createShip } from './ship.spec';

describe("characters", () => {
    it("deal damage works", () => {
        const ship: Ship = <Ship>createShip();
        const carmen: Character = <Character>ship.getCrewByName("Carmen Miranda")
        carmen.health.dealDamage({
            "physical": 18,
            "chemical": 6,
            "genetic": 16,
            "psychological": 6,
            "temperature": 24
        });
        expect(carmen.health.getTotalDamage()).toBe(70);
        expect(carmen.health.getTotalHealth()).toBe(130);
        expect(carmen.health.getHealthPercentage()).toStrictEqual(0.65);

    })
})
