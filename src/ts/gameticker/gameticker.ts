import { Planet } from "../addons/locations/planet";
import { stars } from "../addons/locations/star";
import { selected } from "../addons/selected";
import { ships } from "../addons/ship/ships";
import { selectedDiv } from "../main";
import { play } from "../util/audio";
import { getVerboseDate } from '../util/date';

// useful for debugging
let currentTick = 0;

export function tick() {
    // TODO: Separate these into separate functions
    // basic selected DIV
    if (selected == "") {
        selectedDiv.style.display = 'none';
    } else {
        // make it visible
        const name: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("selected-name");
        
        selectedDiv.style.display = 'block';
        name.textContent = selected;
    }

    // update time
    const today: Date = new Date();
    const currentTime = document.getElementById("time");

    if (currentTime != null) {
        currentTime.textContent = getVerboseDate(4131, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());
    }

    // update stars
    const starsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("star-containers");
    const starsClosed: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("stars-closed");
    if (starsDiv != null) starsDiv.style.display = ships[0].canFly(undefined) ? "flex" : "none";
    if (starsClosed != null) starsClosed.style.display = ships[0].canFly(undefined) ? "none" : "block";

    // update planets
    const planetDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("planet-containers");
    const planetClosed: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("planet-closed");
    
    if (planetDiv != null) {
        planetClosed.style.display = (ships[0].location instanceof Planet) ? "none" : "block";
        planetDiv.style.display = (ships[0].location instanceof Planet) ? "flex" : "none";
        
        const planetHeader: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("planet-header");
        planetHeader.textContent = <string>ships[0].location?.name;

        // fuel
        const planetFuel = <HTMLParagraphElement>document.getElementById("planet-fuel");
        planetFuel.textContent = `You have ${ships[0].fuel} fuel with 5 being used per warp.`

        // refuel
        const planetRefuel: HTMLButtonElement = <HTMLButtonElement>document.getElementById("planet-refuel");
        planetRefuel.textContent = `Buy Fuel (${(<Planet>ships[0].location).fuelCost}$)`
        planetRefuel.onclick = () => {
            const cost = (<Planet>ships[0].location).fuelCost;
            const money = ships[0].money

            if (money >= cost) {
                ships[0].fuel += 1
                ships[0].money -= (<Planet>ships[0].location).fuelCost;
                play("sfx/good.wav");
            } else {
                play("sfx/death.wav");
            }
        }

        // sell fuel
        const planetSell: HTMLButtonElement = <HTMLButtonElement>document.getElementById("planet-fuel-sell");
        planetSell.textContent = `Sell Fuel (${(<Planet>ships[0].location).fuelCost}$)`
        planetSell.onclick = () => {
            const fuel = ships[0].fuel

            if (fuel >= 1) {
                ships[0].fuel -= 1
                ships[0].money += (<Planet>ships[0].location).fuelCost;
                play("sfx/good.wav");
            } else {
                play("sfx/death.wav");
            }
        }
    }

    // update ship and stars
    ships.forEach(ship => {
        ship.tick();
    });

    stars.forEach(star => {
        star.tick();
    })
    
    // update current tick
    currentTick++;
}
