import { Breakroom, Bridge, createFromRoomTemplate, Engines, LifeSupport, Shields } from './util/templates';
import { generateCharacter } from './util/characters';
import { generateShipName } from './util/ship';
import { getVerboseDate } from './util/date';
import { Ship } from './classes/ship/ship';

export let selected: string = "";

export function setSelected(name: string) {
    selected = name;
}

/**
 * The ships that the player can interact with.
 * Tip: ships[0] is ALWAYS the master ship, all playable characters are stored there.
 */
export const ships: Ship[] = [];

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

let selectedDiv = document.createElement("div");
function initSelectedDiv() {
    // basic name
    let name = document.createElement("h2");
    name.textContent = selected;
    name.id = "selected-name";

    // deselect button
    let deselect = document.createElement("button");
    deselect.textContent = "Deselect";

    // this overwrites the previous onclick to prevent repeats
    deselect.onclick = function () {
        // deselected
        setSelected("");
    }
    
    selectedDiv.appendChild(name);
    selectedDiv.appendChild(deselect);
    selectedDiv.classList.add("selected-ui");
    selectedDiv.classList.add("solid");

    // turn it off for now
    selectedDiv.style.display = "none";

    // done initializing
    document.body.appendChild(selectedDiv);
}

function updateUi() {
    // basic selected DIV
    if (selected == "") {
        selectedDiv.style.display = 'none';
    } else {
        // make it visible
        selectedDiv.style.display = 'block';
        let name: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("selected-name");
        name.textContent = selected;
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
    initSelectedDiv();

    // ship
    ships.push(new Ship(generateShipName(), [
        createFromRoomTemplate(Bridge),
        createFromRoomTemplate(LifeSupport),
        createFromRoomTemplate(Engines),
        createFromRoomTemplate(Shields),
        createFromRoomTemplate(Breakroom),
    ], [
        generateCharacter()
    ]));
    shipDetails?.appendChild(ships[0].ui());
    
    setTimeout(updateUi, 10);
}
