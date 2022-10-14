import { Breakroom, Bridge, createFromRoomTemplate, Engines, LifeSupport, Shields } from './util/templates';
import { capitalizeFirstLetter, maxSkillPoints } from './util/characters';
import { generateShipName, generateLocationName, pickFromArray } from './util/rng';
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
import { initAudio, play } from './util/audio';

export const app = document.querySelector<HTMLDivElement>('#app');
const navbar = document.getElementById("navbar");
const selectedDiv: HTMLDivElement = <HTMLDivElement>initSelectedDiv();

// UI hell
function initApp() {
    const header = quickCreate("h1", "Astrionics");
    
    const setupButton = <HTMLButtonElement>quickCreate("button", "New Game");
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
    // audio
    initAudio();

    // div
    const setup = document.createElement("div");
    
    // name
    const rname = document.createElement("p");
    rname.textContent = characterName + ", captain";

    const rnameButton = <HTMLButtonElement>quickCreate("button", "Randomize Name");
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
        setup?.appendChild(button);
        setup?.appendChild(document.createElement("br"));
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

    const starsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("star-containers");
    const starsClosed: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("stars-closed");
    if (starsDiv != null) starsDiv.style.display = ships[0].pilotingControls ? "flex" : "none";
    if (starsClosed != null) starsClosed.style.display = ships[0].pilotingControls ? "none" : "block";

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
    if (navbar != null) {
        navbar.style.opacity = "1";
    }
    currentTime.id = "time";
    
    // init time
    app?.appendChild(currentTime);
    app?.appendChild(initStatusBar());
    
    // init summary
    shipSummary.textContent = "Ships";
    shipSummary.id = "ship-summary";
    shipDetails.appendChild(shipSummary);
    
    // init stars
    starSummary.id = "stars-summary";
    const starDiv = document.createElement("div");
    starDiv.id = "star-containers";

    const starDisabled = document.createElement("h2")
    starDisabled.id = "stars-closed";
    starDisabled.classList.add("error");
    starDisabled.textContent = "Piloting systems are not manned or available!";
    starDisabled.style.textAlign = "center";
    starDisabled.style.display = "none";
    starDetails.appendChild(starDisabled);

    starDiv.classList.add("items");
    starSummary.textContent = "Stars";
    starDetails.appendChild(starSummary);
    
    const starAmount: number = Math.round(Math.random() * 18) + 1;

    for (let i = 0; i < starAmount; i++) {
        const star = new Star(generateLocationName(), []);
        const planets: Planet[] = [];
        let planetAmount: number = Math.round(Math.random() * 4);
        if (planetAmount < 1) planetAmount++;
        for (let j = 0; j < planetAmount; j++) {
            planets.push(new Planet(generateLocationName(), star.id));          
        }

        planets.forEach(planet => {
            star.addPlanet(planet);
        })
        starDiv.appendChild(star.init());
        addStar(star);
    }

    app?.appendChild(shipDetails);
    app?.appendChild(starDetails);
    starDetails.appendChild(starDiv);
    
    // initialize div
    app?.appendChild(selectedDiv);

    // ship
    const ship = new Ship(generateShipName(), [], []);
    ship.addPart(createFromRoomTemplate(Bridge, ship.id)),
    ship.addPart(createFromRoomTemplate(LifeSupport, ship.id)),
    ship.addPart(createFromRoomTemplate(Engines, ship.id)),
    ship.addPart(createFromRoomTemplate(Shields, ship.id)),
    ship.addPart(createFromRoomTemplate(Breakroom, ship.id)),
    ship.location = pickFromArray(stars);
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

document.addEventListener("click", () => {
    initAudio();
})
