import { app } from "../../main";
import { play } from "../../util/audio";
import { next, prob } from "../../util/rng";
import { appendChilds, quickCreate, updateButton } from "../../util/ui";
import { Character } from "../humanoid/character";
import { selected, setSelected } from "../selected";
import { mainShip } from "../ship/ships";
import { CoalOre, IronOre, Plastic, Steel } from "./items/ore";
import { log, contextWrapper } from '../cwrapper/contextWrapper';

export function mineTick() {
    const load = <HTMLButtonElement>document.getElementById("mine-load");
    const mine = <HTMLButtonElement>document.getElementById("mine-mine");
    const div = <HTMLDivElement>document.getElementById("mine");
    const error = <HTMLHeadingElement>document.getElementById("mine-error");

    div.classList.add('item');

    if (mainShip.getPartById("airlock") != null) {
        if (mainShip.getCrewInRoom("airlock").length < 1) {
            error.style.display = "block";
            div.style.display = "none";
        } else {
            error.style.display = "none";
            div.style.display = "block";
        }
    }

    mainShip.inmine.cargoloop(<HTMLDivElement>document.getElementById("mine-cargo"));
    updateButton(load, selected == "" ? true : false, true);
    updateButton(mine, selected == "" ? true : false, true);
}

export function mineInit() {
    // basic div & header
    const details = <HTMLDetailsElement>quickCreate("details");
    const summary = <HTMLElement>quickCreate("summary", "Mining");
    const div = <HTMLDivElement>quickCreate("div");
    div.classList.add("item");
    div.id = "mine";

    const error: HTMLHeadingElement = <HTMLHeadingElement>quickCreate("h2", "You have no miners in the airlock.")
    error.classList.add("error");
    error.style.display = "none";
    error.style.textAlign = "center";
    error.id = "mine-error";

    div.classList.add('xl');

    // mining
    // mining should be simple
    // a colonist should take 10 seconds to mine
    // a colonist should take 10 seconds to load it into the cargo bay
    // buttons
    const load = <HTMLButtonElement>quickCreate("button", "Load");
    const mine = <HTMLButtonElement>quickCreate("button", "Mine");
    
    load.id = "mine-load";
    mine.id = "mine-mine";
    
    updateButton(load, selected == "" ? true : false, true);
    updateButton(mine, selected == "" ? true : false, true);

    function progressBar(ms: number, onFinish: CallableFunction, currentCharacter: Character): HTMLProgressElement {
        const bar = <HTMLProgressElement>quickCreate("progress");
        
        bar.max = 100;
        currentCharacter.disabled = true;
        setSelected("", true);
    
        const id = setInterval(() => {
            bar.value += .1;

            if (bar.value == bar.max) {
                bar.remove();
                
                currentCharacter.disabled = false;

                // no more infinite loops
                clearInterval(id);
                bar.value = -1000000;
                onFinish(currentCharacter);
            }
        }, ms / 10);

        return bar
    }

    mine.addEventListener("click", () => {
        log(contextWrapper, `${mainShip.getCrewByName(selected)?.name} begins to chip at the mine.`);
        const bar = progressBar(100, (character: Character) => {
            const toBeLoaded = []; // incoming ore
            play(`sfx/boom${next(1,2)}.wav`)

            character.health.dealDamage({
                "physical": 4,
                "psychological": 2,
                "chemical": 1,
                "genetic": 0,
                "temperature": 0
            });

            
            if (prob(10)) {
                // TODO: events
                mainShip.incidents++;
            }

            // ORE
            if (prob(60)) {
                for (let i = 0; i < next(4,10); i++) {
                    toBeLoaded.push(new CoalOre())
                }
            }

            if (prob(25)) {
                for (let i = 0; i < next(2,7); i++) {
                    toBeLoaded.push(new IronOre())
                }
            }

            if (prob(10)) {
                for (let i = 0; i < next(2,4); i++) {
                    toBeLoaded.push(new Steel())
                }
            } else if (prob(5)) {
                for (let i = 0; i < next(1,3); i++) {
                    toBeLoaded.push(new Plastic())
                }
            }

            bar.remove();

            // ctxlog
            let message = `${character.name} chips at the mine, but gets no ore.`;

            if (toBeLoaded.length > 0) {
                for(let i = 0; i < toBeLoaded.length; i++) {
                    mainShip.inmine.cargo.push(toBeLoaded[i]);
                    toBeLoaded.splice(i, 1);
                    i--;
                }

                message = `${character.name} chips at the mine and loads ore to the loading bay.`;
            }

            log(contextWrapper, message);

        }, <Character>mainShip.getCrewByName(selected));
        div.appendChild(bar);
    });

    load.addEventListener("click", () => {
        log(contextWrapper, `${mainShip.getCrewByName(selected)?.name} begins to load ore into the cargo bay.`);
        const bar = progressBar(100, (character: Character) => {
            // move
            for(let i = 0; i < mainShip.inmine.cargo.length; i++) {
                mainShip.cargobay.cargo.push(mainShip.inmine.cargo[i]);
                mainShip.inmine.cargo.splice(i, 1);
                i--;
            }
            log(contextWrapper, `${character.name} loads ore into the cargo bay.`);


            play("sfx/notify.wav");
        }, <Character>mainShip.getCrewByName(selected));
        div.appendChild(bar);
    });
    
    // cargo bay
    const cdetail: HTMLDetailsElement = <HTMLDetailsElement>quickCreate("details");
    const csummary: HTMLElement = <HTMLElement>quickCreate("summary", "Loading Bay");
    const cdiv: HTMLDivElement = <HTMLDivElement>quickCreate("div");
    cdiv.classList.add("items");
    cdiv.id = "mine-cargo"

    appendChilds(cdetail, [csummary, cdiv]);
    mainShip.inmine.cargoloop(cdiv);

    appendChilds(details, [summary, error, div]);
    appendChilds(div, [quickCreate("h2", "Mining"), load, mine, cdetail])
    app.appendChild(details);
}