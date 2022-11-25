import { describe, expect, it } from 'vitest';
import { Ship } from '../src/ts/addons/ship/ship';
import { Part } from '../src/ts/addons/ship/part';
import { Character } from '../src/ts/addons/humanoid/character';
import { Health } from '../src/ts/addons/humanoid/health';
import { Breakroom, Bridge, createFromRoomTemplate, Engines, LifeSupport } from '../src/ts/util/templates';

/**
 * Used to create a dummy character for test-purposes only
 * @returns Character
 */
 export function makeCharacter(id: string) {
    return new Character(
        // if you know you know
        "Carmen Miranda",
        "ghost",
        "engine",
        new Health({
            "physical": 0,
            "temperature": 0,
            "psychological": 0,
            "chemical": 0,
            "genetic": 0,
        }),
        {
            "strength": 10,
            "agility": 10,
            "fortitude": 10, 
            "electrical": 10,
            "mechanical": 10,
            "machinery": 10,
            "intelligence": 10
        },
        id
    );
}

/**
 * Used to create a dummy ship for test-purposes only
 * @returns Ship
 */
export function createShip(): Ship {
    const ship = new Ship("testship100", [], []);
    ship.addPart(createFromRoomTemplate(Bridge, ship.id));
    ship.addPart(createFromRoomTemplate(Breakroom, ship.id));
    ship.addPart(createFromRoomTemplate(LifeSupport, ship.id));
    ship.addPart(createFromRoomTemplate(Engines, ship.id));
    ship.addCrew(makeCharacter(ship.id));
    return ship
}

describe("ship", () => {
    it("made a ship without errors", () => {
        createShip();
    });
    it("get crew by name works", () => {
        const ship: Ship = createShip();

        expect(ship.getCrewByName("Carmen Miranda")).toStrictEqual(makeCharacter(ship.id));
    })
    it("get part by id works", () => {
        const ship: Ship = createShip();
        const bridge: Part = <Part>ship.getPartById("bridge");

        expect(bridge.name).toBe("Bridge");
    })
    it("total health array works", () => {
        const ship: Ship = createShip();

        expect(ship.totalHull()).toStrictEqual([325,325]);
    })
    it("healing works", () => {
        const ship: Ship = createShip();
        const bridge: Part = <Part>ship.getPartById("bridge");
        bridge.dealDamage(25);
        expect(bridge.totalHp).toBe(75)
        bridge.heal()
        expect(bridge.totalHp).toBe(100)
    })
});
