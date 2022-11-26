import { selectedDiv } from "../../main";
import { getVerboseDate } from "../../util/date";
import { selected } from "../selected";
import { ships } from "../ship/ships";

export let ctick = 0;

export function setCTick(newCTick: number) {
    ctick = newCTick;
}

export function tick() {    
    // basic selected DIV
    if (selected == "") {
        selectedDiv.style.display = 'none';
    } else {
        // make it visible
        selectedDiv.style.display = 'block';
        const name: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("selected-name");
        if (name != null) {
            name.textContent = selected;
        }
    }

    const today: Date = new Date();
    const currentTime = document.getElementById("time");
    if (currentTime != null) {
        currentTime.textContent = getVerboseDate(2462, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());
    }

    ships.forEach(ship => {
        ship.tick();
    });

    ctick++;
}