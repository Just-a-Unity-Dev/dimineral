import { describe, expect, it } from 'vitest';
import { Ship } from '../src/ts/classes/ship/ship';
import { Part } from '../src/ts/classes/ship/part';
import { Character } from '../src/ts/classes/humanoid/character';
import { Health } from '../src/ts/classes/humanoid/health';

/**
 * Used to create a dummy character for test-purposes only
 * @returns Character
 */
 export function makeCharacter() {
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
        }
    );
}

/**
 * Used to create a dummy ship for test-purposes only
 * @returns Ship
 */
export function createShip(): Ship {
    const parts = [
        new Part(
            "Bridge",
            "bridge",
            50,
            50,
            0
            ),
            new Part(
                "Life Support",
                "lifesupport",
                25,
                25,
                100
                ),
                new Part(
                    "Engines",
                    "engine",
                    100,
                    100,
                    0
                    )
                ];
    return new Ship("testship100", parts, [makeCharacter()]);
}

describe("ship", () => {
    it("made a sihp without errors", () => {
        createShip();
    });
    it("get crew by name works", () => {
        const ship: Ship = createShip();

        expect(ship.getCrewByName("Carmen Miranda")).toStrictEqual(makeCharacter());
    })
    it("get part by id works", () => {
        const ship: Ship = createShip();
        
        expect(ship.getPartById("bridge").name).toBe("Bridge");
    })
    it("total health array works", () => {
        const ship: Ship = createShip();

        expect(ship.totalHull()).toStrictEqual([175,100,275]);
    })
});
