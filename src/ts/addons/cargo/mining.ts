import { app } from "../../main";
import { appendChilds, quickCreate } from "../../util/ui";

export // TODO: Split this into it's own code?
function mining() {
    const details: HTMLDetailsElement = <HTMLDetailsElement>quickCreate("details");
    const summary: HTMLElement = <HTMLElement>quickCreate("summary", "Mining");
    const div: HTMLDivElement = document.createElement("div");
    div.classList.add("item");

    appendChilds(details, [summary, div]);
    appendChilds(div, [quickCreate("h2", "Mining")])
    app.appendChild(details);
}