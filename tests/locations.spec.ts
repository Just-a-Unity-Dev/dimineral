
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
        console.log(ship.getCrewByName("Carmen Miranda")?.location)
        console.log(ship.getCrewInRoom("bridge"))
        
        // TODO: fix this test broken
        expect(ship.location).toBe(planet2);
        expect(ship.fuel).toBe(25);
    });
    it("handling", () => {
        ship.fuel = 0;
        expect(ship.fly(planet2)).toBe(false);
    });
})
