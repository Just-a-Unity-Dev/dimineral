
import { describe, expect, it } from 'vitest';
import { Character } from '../src/ts/addons/humanoid/character';
import { Planet } from '../src/ts/addons/locations/planet';
import { Star } from '../src/ts/addons/locations/star';
import { ships } from '../src/ts/addons/ship/ships';
import { createShip } from './ship.spec';

describe("locations", () => {
    const star = new Star("test star", []);
    const planet1 = new Planet("planet1", star.id);
    const planet2 = new Planet("planet2", star.id);
    const planet3 = new Planet("planet3", star.id);
    const ship = createShip();
    const carmen = <Character>ship.getCrewByName("Carmen Miranda");

    expect(carmen).not.toBe(null);
    expect(carmen).not.toBe(undefined);

    ship.setLocation(planet1);
    ships.push(ship);
    
    star.addPlanet(planet1);
    star.addPlanet(planet2);
    star.addPlanet(planet3);
    carmen.setLocation("bridge");
    it("can fly", () => {
        expect(ship.fly(planet2)).toBe(true);
        expect(ship.location).toBe(planet2);
        expect(ship.fuel).toBe(25);
    });
    it("fuel handling", () => {
        ship.fuel = 0;
        expect(ship.fly(planet1)).toBe(false);
        expect(ship.location).toBe(planet2);
        ship.fuel = 30;
    });
    it("locked piloting handling", () => {
        carmen.setLocation("Breakroom")
        expect(ship.fly(planet1)).toBe(false);
        expect(ship.location).toBe(planet2);
        carmen.setLocation("Bridge")
    });
    it("engine disappearance handling", () => {
        ship.getPartById("Engines")?.destroy();
        expect(ship.fly(planet1)).toBe(false);
        expect(ship.location).toBe(planet2);
    });
})
