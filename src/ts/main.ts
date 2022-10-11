import { Breakroom, Bridge, createFromRoomTemplate, Engines, LifeSupport, Shields } from './util/templates';
import { capitalizeFirstLetter, maxSkillPoints } from './util/characters';
import { generateShipName, generatePlanetName, pickFromArray } from './util/rng';
import { getVerboseDate } from './util/date';
import { Ship } from './addons/ship/ship';
import { ships } from "./addons/ship/ships";
import { initSelectedDiv, selected } from './addons/selected';
import { Skills } from './addons/humanoid/skills';
import { generateName } from './util/rng';
import { Character } from './addons/humanoid/character';
import { Health } from './addons/humanoid/health';
import { addS, quickCreate } from './util/ui';
import { addStar, Star, stars } from './addons/locations/star';
import { Planet } from './addons/locations/planet';
import { initStatusBar } from './addons/status/status';

const app = document.querySelector<HTMLDivElement>('#app');
const selectedDiv: HTMLDivElement = <HTMLDivElement>initSelectedDiv();

// UI hell
function initApp() {
    const header = document.createElement("h1");
    header.textContent = "Astrionics";

    const setupButton = document.createElement("button");
    setupButton.textContent = "New Game";
    setupButton.addEventListener("click", () => {
        setupGame();
        setupButton.remove();
    });

    app?.appendChild(header);
    app?.appendChild(setupButton);
}

let characterSkill: Skills = {};
let characterName: string = generateName();

function setupGame() {
    // div
    const setup = document.createElement("div");
    
    // name
    const rname = document.createElement("p");
    rname.textContent = characterName + ", captain";

    const rnameButton = document.createElement("button");
    rnameButton.textContent = "Randomize Name";
    rnameButton.addEventListener("click", () => {
        characterName = generateName();
        rname.textContent = characterName + ", captain";
    });

    setup.appendChild(rname);
    setup.appendChild(rnameButton);
    setup?.appendChild(quickCreate("br"));
    setup?.appendChild(quickCreate("br"));

    // skill points
    const skills: Skills = <Skills>{
        "strength": 4,
        "agility": 2,
        "fortitude": 1,
        "electrical": 3,
        "machinery": 5,
        "mechanical": 3,
        "intelligence": 2,
    };
    const keys: string[] = Object.keys(skills);
    let spent = 0;
    
    // lets get skills up to date
    keys.forEach(el => spent += skills[el])

    const totalLabel: HTMLParagraphElement = <HTMLParagraphElement>quickCreate("p", `SPENT: ${spent}/${maxSkillPoints}`)
    setup.appendChild(totalLabel);


    keys.forEach((key: string) => {
        const button = document.createElement("button")
        const add = (amount: number) => {
            skills[key] += amount;
            spent += amount;
            if (skills[key] > 9) {
                skills[key] = 0;
                spent -= 10;
            }
            if (skills[key] < 0) {
                skills[key] = 9;
                spent += 10;
            }

            button.textContent = `${skills[key]} ${addS(skills[key], "point")} on ${capitalizeFirstLetter(key)}`;
            playButton.disabled = (spent > maxSkillPoints);
            totalLabel.style.color = (spent > maxSkillPoints) ? "#ff3e3e" : "#fff";
            totalLabel.textContent = 
                (spent > maxSkillPoints) ?
                `SPENT: ${spent}/${maxSkillPoints} (${spent - maxSkillPoints} ${addS(spent - maxSkillPoints, "point")} extra!)` :
                `SPENT: ${spent}/${maxSkillPoints}`;
            
            characterSkill = skills;
        };

        button.textContent = `${skills[key]} points on ${capitalizeFirstLetter(key)}`;
        button.style.width = "300px";
        button.style.textAlign = "center";
        button.addEventListener("click", () => {add(1)});
        button.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            add(-1)
        });
        setup?.appendChild(button);
        setup?.appendChild(document.createElement("br"));
        characterSkill = skills;
    });
    setup?.appendChild(document.createElement("br"));

    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.addEventListener("click", () => {
        initGame();
        characterSkill = skills;
        setup.remove();
    });

    app?.appendChild(setup);
    setup?.appendChild(playButton);
}

function tick() {    
    // basic selected DIV
    if (selected == "") {
        selectedDiv.style.display = 'none';
    } else {
        // make it visible
        selectedDiv.style.display = 'block';
        const name: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("selected-name");
        // if (name != null) {
            name.textContent = selected;
        // }
    }

    const today: Date = new Date();
    const currentTime = document.getElementById("time");
    if (currentTime != null) {
        currentTime.textContent = getVerboseDate(4131, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());
    }

    ships.forEach(ship => {
        ship.tick();
    });

    stars.forEach(star => {
        star.tick();
    })
    
    setTimeout(tick, 100)
}

function initGame() {
    const shipDetails = document.createElement("details");
    const shipSummary = document.createElement("summary");
    const starDetails = document.createElement("details");
    const starSummary = document.createElement("summary");
    const currentTime = document.createElement("p");
    currentTime.id = "time";

    // init time
    app?.appendChild(currentTime);
    app?.appendChild(initStatusBar());

    // init summary
    shipSummary.textContent = "Ships";
    shipDetails.appendChild(shipSummary);

    starSummary.textContent = "Stars";
    starDetails.appendChild(starSummary);

    const starAmount: number = Math.round(Math.random() * 18) + 1;

    for (let i = 0; i < starAmount; i++) {
        const star = new Star(generateShipName(), []);
        const planets: Planet[] = [];
        let planetAmount: number = Math.round(Math.random() * 4);
        if (planetAmount < 1) planetAmount++;
        for (let j = 0; j < planetAmount; j++) {
            planets.push(new Planet(generatePlanetName(), star.id));          
        }

        planets.forEach(planet => {
            star.addPlanet(planet);
        })
        starDetails.appendChild(star.init());
        addStar(star);
    }

    app?.appendChild(shipDetails);
    app?.appendChild(starDetails);
    
    // initialize div
    app?.appendChild(selectedDiv);

    // ship
    const ship = new Ship(generateShipName(), [], []);
    ship.addPart(createFromRoomTemplate(Bridge, ship.id)),
    ship.addPart(createFromRoomTemplate(LifeSupport, ship.id)),
    ship.addPart(createFromRoomTemplate(Engines, ship.id)),
    ship.addPart(createFromRoomTemplate(Shields, ship.id)),
    ship.addPart(createFromRoomTemplate(Breakroom, ship.id)),
    ship.location = pickFromArray(<Star[]>pickFromArray(stars).planets);
    // ship.addCrew(generateCharacter(ship.id));
    ship.addCrew(new Character(
        characterName,
        "captain",
        "breakroom",
        new Health({"physical": 0, "temperature": 0, "chemical": 0, "psychological": 0, "genetic": 0}),
        characterSkill,
        ship.id
    ))

    ships.push(ship);
    shipDetails?.appendChild(ships[0].init());
    
    setTimeout(tick, 10);
}

initApp();
