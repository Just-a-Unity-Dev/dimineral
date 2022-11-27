import { app } from "../../main";
import { appendChilds, quickCreate, updateButton } from "../../util/ui";
import { selected } from "../selected";
import { mainShip } from "../ship/ships";

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


    updateButton(load, selected == "" ? true : false, true);
    updateButton(mine, selected == "" ? true : false, true);
}

export function mineInit() {
    // basic div & header
    const details: HTMLDetailsElement = <HTMLDetailsElement>quickCreate("details");
    const summary: HTMLElement = <HTMLElement>quickCreate("summary", "Mining");
    const div: HTMLDivElement = document.createElement("div");
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
    
    // cargo bay
    const cdetail: HTMLDetailsElement = document.createElement("details");
    const csummary: HTMLElement = <HTMLElement>quickCreate("summary", "Loading Bay");
    const cdiv: HTMLDivElement = document.createElement("div");

    appendChilds(cdetail, [csummary, cdiv]);
    mainShip.inmine.cargoloop(cdiv);

    appendChilds(details, [summary, error, div]);
    appendChilds(div, [quickCreate("h2", "Mining"), load, mine, cdetail])
    app.appendChild(details);
}