import { app } from "../../main";
import { appendChilds, quickCreate } from "../../util/ui";

export // TODO: Split this into it's own code?
function mining() {
    // basic div & header
    const details: HTMLDetailsElement = <HTMLDetailsElement>quickCreate("details");
    const summary: HTMLElement = <HTMLElement>quickCreate("summary", "Mining");
    const div: HTMLDivElement = document.createElement("div");
    div.classList.add("item");

    // mining
    // mining should be simple
    // a colonist should take 10 seconds to mine
    // a colonist should take 10 seconds to load it into the cargo bay

    appendChilds(details, [summary, div]);
    appendChilds(div, [quickCreate("h2", "Mining")])
    app.appendChild(details);
}