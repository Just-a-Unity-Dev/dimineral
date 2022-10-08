import { Character } from './classes/humanoid/character';
import { Part } from './classes/ship/part';
import { Ship } from './classes/ship/ship';
import { Health } from './classes/humanoid/health';
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

function updateUi() {
    ships.forEach(ship => {
        ship.updateUi();
    });
    setTimeout(updateUi, 100)
}

updateUi();

ships.push(new Ship("master ship", [
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
            "strength": 10,
            "agility": 10,
            "fortitude": 10, 
            "electrical": 10,
            "mechanical": 10,
            "machinery": 10,
            "intelligence": 10
        }
    ),
    new Character(
        "REAL engineer",
        "engineer",
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
    ),
    new Character(
        "REAL engineer",
        "engineer",
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
    ),
    new Character(
        "REAL engineer",
        "engineer",
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
    )
]));
shipDetails?.appendChild(ships[0].ui());
