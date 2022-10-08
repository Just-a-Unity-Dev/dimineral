import { Character } from './classes/humanoid/character';
import { Part } from './classes/ship/part';
import { Ship } from './classes/ship/ship';
import { Health } from './classes/humanoid/health';
import { generateName } from './util/ship';
export let selected: string = "";

export function setSelected(name: string) {
    selected = name;
}

/**
 * The ships that the player can interact with
 * Tip: ships[0] is ALWAYS the master ship, all playable characters are stored there.
 */
let ships: Ship[] = [];

const app = document.querySelector<HTMLDivElement>('#app');
const header = document.createElement("h1");
const shipDetails = document.createElement("details");
const shipSummary = document.createElement("summary")
shipSummary.textContent = "Ships";
shipDetails.appendChild(shipSummary);

app?.appendChild(header);
app?.appendChild(shipDetails);
header.textContent = "Astrionics";

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
    document.body.appendChild(selectedDiv);
}

initSelectedDiv();

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

    ships.forEach(ship => {
        ship.updateUi();
    });
    setTimeout(updateUi, 100)
}

ships.push(new Ship(generateName(), [
    new Part("all-in-one", "aio", 100, 100, 100)
], [
    new Character(
        // if you know you know
        "Carmen Miranda",
        "ghost",
        "cargobay",
        new Health({
            "physical": 0,
            "temperature": 0,
            "psychological": 0,
            "chemical": 0,
            "genetic": 0,
        }),
        {
            "strength": 6,
            "agility": 6,
            "fortitude": 6, 
            "electrical": 6,
            "mechanical": 6,
            "machinery": 6,
            "intelligence": 6
        }
    ),
]));
shipDetails?.appendChild(ships[0].ui());

setTimeout(updateUi, 10);
