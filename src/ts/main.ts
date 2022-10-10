import { Breakroom, Bridge, createFromRoomTemplate, Engines, LifeSupport, Shields } from './util/templates';
import { generateCharacter } from './util/characters';
import { generateShipName } from './util/ship';
import { getVerboseDate } from './util/date';
import { Ship } from './classes/ship/ship';
import { initSelectedDiv, selected } from './addons/selected';

/**
 * The ships that the player can interact with.
 * Tip: ships[0] is ALWAYS the master ship, all playable characters are stored there.
 */
export const ships: Ship[] = [];

export function getShipById(id: string): Ship | undefined {
    return ships.find(e => e.id == id);
}

export function removeShip(ship: Ship) {
    document.getElementById(ship.id)?.remove();
    ships.splice(ships.findIndex(s => s == ship), 1)
}

// UI hell
const app = document.querySelector<HTMLDivElement>('#app');
const header = document.createElement("h1");
header.textContent = "Astrionics";

const playButton = document.createElement("button");
playButton.textContent = "Play";
playButton.addEventListener("click", () => {
    initGame();
    playButton.remove();
});

const shipDetails = document.createElement("details");
const shipSummary = document.createElement("summary")
const currentTime = document.createElement("p");

app?.appendChild(header);
app?.appendChild(playButton);

let selectedDiv: HTMLDivElement = <HTMLDivElement>initSelectedDiv();

function updateUi() {
    // basic selected DIV
    if (selected == "") {
        selectedDiv.style.display = 'none';
    } else {
        // make it visible
        selectedDiv.style.display = 'block';
        let name: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("selected-name");
        // if (name != null) {
            name.textContent = selected;
        // }
    }

    let today: Date = new Date();
    currentTime.textContent = getVerboseDate(4131, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());

    ships.forEach(ship => {
        ship.updateUi();
    });
    setTimeout(updateUi, 100)
}

function initGame() {
    // init time
    app?.appendChild(currentTime);

    // init summary
    shipSummary.textContent = "Ships";
    shipDetails.appendChild(shipSummary);
    app?.appendChild(shipDetails);
    
    // initialize div
    app?.appendChild(selectedDiv);

    // ship
    let ship = new Ship(generateShipName(), [], []);
    ship.addPart(createFromRoomTemplate(Bridge, ship.id)),
    ship.addPart(createFromRoomTemplate(LifeSupport, ship.id)),
    ship.addPart(createFromRoomTemplate(Engines, ship.id)),
    ship.addPart(createFromRoomTemplate(Shields, ship.id)),
    ship.addPart(createFromRoomTemplate(Breakroom, ship.id)),
    ship.addCrew(generateCharacter(ship.id));

    ships.push(ship);
    shipDetails?.appendChild(ships[0].ui());
    
    setTimeout(updateUi, 10);
}
