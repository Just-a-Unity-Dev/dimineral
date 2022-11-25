import { Breakroom, Bridge, createFromRoomTemplate, Engines, LifeSupport } from './util/templates';
import { capitalizeFirstLetter, maxSkillPoints } from './util/characters';
import { generateShipName } from './util/rng';
import { getVerboseDate } from './util/date';
import { Ship } from './addons/ship/ship';
import { ships } from "./addons/ship/ships";
import { initSelectedDiv, selected } from './addons/selected';
import { Skills } from './addons/humanoid/skills';
import { generateName } from './util/rng';
import { Character } from './addons/humanoid/character';
import { Health } from './addons/humanoid/health';
import { addS, quickCreate, appendChilds } from './util/ui';
import { initStatusBar } from './addons/status/status';
import { initAudio, play } from './util/audio';

export const app = <HTMLDivElement>document.querySelector<HTMLDivElement>('#app');
const navbar = document.getElementById("navbar");
const selectedDiv: HTMLDivElement = <HTMLDivElement>initSelectedDiv();

// UI hell
function initApp() {
    const header = <HTMLHeadingElement>quickCreate("h1", "Dimineral");
    const logo = <HTMLImageElement>quickCreate("img", "test", "./textures/logo.svg")
    
    logo.style.maxWidth = "256px";

    const setupButton = <HTMLButtonElement>quickCreate("button", "New Game");
    setupButton.addEventListener("click", () => {
        setupGame();
        setupButton.remove();
        logo.remove();
    });

    appendChilds(app, [header, logo, document.createElement("br"), setupButton]);
}

let characterSkill: Skills = {};
let characterName: string = generateName();

function setupGame() {
    // audio
    initAudio();

    // div
    const setup = document.createElement("div");
    
    // name
    const rname = document.createElement("p");
    rname.textContent = characterName + ", miner";

    const rnameButton = <HTMLButtonElement>quickCreate("button", "Randomize Name");
    rnameButton.addEventListener("click", () => {
        characterName = generateName();
        rname.textContent = characterName + ", miner";
    });

    setup.appendChild(rname);
    setup.appendChild(rnameButton);
    appendChilds(setup, [rname, rnameButton, quickCreate("br"), quickCreate("br")])

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
        const button = <HTMLButtonElement>quickCreate("button", undefined)
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
        appendChilds(setup, [document.createElement("br"), button]);
        characterSkill = skills;
    });
    setup?.appendChild(document.createElement("br"));

    const playButton = <HTMLButtonElement>quickCreate("button", "Play");
    playButton.addEventListener("click", () => {
        characterSkill = skills;
        playButton.disabled = true;
        play("sfx/warp.wav");
        if (app != null)
            app.style.opacity = '0';
        setTimeout(() => {
            initGame();
            if (app != null)
                app.style.opacity = '1';
            setup.remove();
        }, 500);
    });

    appendChilds(app, [setup]);
    appendChilds(setup, [playButton])
}

function tick() {    
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
}

function initGame() {
    appendChilds(app, [selectedDiv]);

    // init time
    const currentTime = document.createElement("p");
    if (navbar != null) {
        navbar.style.opacity = "1";
    }
    currentTime.id = "time";
    appendChilds(app, [currentTime, initStatusBar()]);
    
    // init summary
    // ship
    const ship = new Ship(generateShipName(), [], []);
    ship.addPart(createFromRoomTemplate(Bridge, ship.id)),
    ship.addPart(createFromRoomTemplate(LifeSupport, ship.id)),
    ship.addPart(createFromRoomTemplate(Engines, ship.id)),
    ship.addPart(createFromRoomTemplate(Breakroom, ship.id)),
    // ship.addCrew(generateCharacter(ship.id));
    ship.addCrew(new Character(
        characterName,
        "miner",
        "breakroom",
        new Health({"physical": 0, "temperature": 0, "chemical": 0, "psychological": 0, "genetic": 0}),
        characterSkill,
        ship.id
    ));

    ships.push(ship);
    app.appendChild(ships[0].init());
    
    setInterval(tick, 100);
}

initApp();

document.addEventListener("click", () => {
    initAudio();
})
