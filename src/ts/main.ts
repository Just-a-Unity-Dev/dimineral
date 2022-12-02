import { Airlock, Breakroom, Bridge, createFromRoomTemplate, LifeSupport, Medbay } from './util/templates';
import { capitalizeFirstLetter, maxSkillPoints } from './util/characters';
import { generateShipName, generateString } from './util/rng';
import { Ship } from './addons/ship/ship';
import { mainShip, setMainShip } from "./addons/ship/ships";
import { Skills } from './addons/humanoid/skills';
import { generateName } from './util/rng';
import { Character } from './addons/humanoid/character';
import { Health } from './addons/humanoid/health';
import { addS, quickCreate, appendChilds } from './util/ui';
import { tick } from './addons/ticker/tick';
import { initStatusBar } from './addons/status/status';
import { initAudio, play } from './util/audio';
import { IronOre } from './addons/cargo/items/ore';
import { mineInit } from './addons/cargo/mining';
import { initSelectedDiv } from './addons/selected';
import { contextWrapper } from './addons/cwrapper/contextWrapper';

export const app = <HTMLDivElement>document.querySelector<HTMLDivElement>('#app');
export const navbar = document.getElementById("navbar");
export const selectedDiv: HTMLDivElement = initSelectedDiv();

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

    appendChilds(app, [header, logo, quickCreate("br"), setupButton]);
}

let characterSkill: Skills = {};
let characterName: string = generateName();

function setupGame() {
    // audio
    initAudio();

    // div
    const setup = <HTMLDivElement>quickCreate("div");
    
    // name
    const rname = quickCreate("p");
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
        appendChilds(setup, [quickCreate("br"), button]);
        characterSkill = skills;
    });
    setup?.appendChild(quickCreate("br"));

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

function initGame() {
    appendChilds(app, [selectedDiv]);

    // init time
    const currentTime = <HTMLParagraphElement>quickCreate("p");
    if (navbar != null) {
        navbar.style.opacity = "1";
    }
    currentTime.id = "time";
    appendChilds(app, [currentTime, initStatusBar()]);
    
    // init summary
    const ship = () => {
        // ship
        const ship = new Ship(
            generateShipName(),
            [],
            [],
            generateString(15),
            [new IronOre(),new IronOre(),new IronOre(),new IronOre(),new IronOre()],
            // [new CoalOre(),new CoalOre(),new CoalOre(),new CoalOre(),new CoalOre()]
        );
        ship.addPart(createFromRoomTemplate(Bridge, ship.id)),
        ship.addPart(createFromRoomTemplate(LifeSupport, ship.id)),
        ship.addPart(createFromRoomTemplate(Medbay, ship.id)),
        ship.addPart(createFromRoomTemplate(Breakroom, ship.id)),
        ship.addPart(createFromRoomTemplate(Airlock, ship.id)),
        // ship.addCrew(generateCharacter(ship.id));
        ship.addCrew(new Character(
            characterName,
            "miner",
            "breakroom",
            new Health({"physical": 0, "temperature": 0, "chemical": 0, "psychological": 0, "genetic": 0}),
            characterSkill,
            ship.id
        ));

        setMainShip(ship);
        mineInit();
        app.appendChild(mainShip.init());
    };

    ship();

    document.body.prepend(contextWrapper);

    setInterval(tick, 100);
}

initApp();

document.addEventListener("click", () => {
    initAudio();
})
