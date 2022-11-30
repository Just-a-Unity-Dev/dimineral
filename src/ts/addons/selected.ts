import { play } from "../util/audio";
import { quickCreate } from "../util/ui";
import { inputs } from './input';

export let selected = "";

export function setSelected(name: string, override = false) {
    if (name == "" && inputs["Shift"] && !override) return;
    selected = name;
}

/**
 * Initializes the selected div
 */
export function initSelectedDiv(): HTMLDivElement {
    const selectedDiv = <HTMLDivElement>quickCreate("div");

    // basic name
    const name = <HTMLHeadingElement>quickCreate("h2");
    name.textContent = selected;
    name.id = "selected-name";

    // deselect button
    const deselect = <HTMLButtonElement>quickCreate("button", "Deselect");

    // this overwrites the previous onclick to prevent repeats
    deselect.onclick = function () {
        // deselected
        play("sfx/sift.wav")
        setSelected("", true);
    }
    
    selectedDiv.appendChild(name);
    selectedDiv.appendChild(deselect);
    selectedDiv.classList.add("selected-ui");
    selectedDiv.classList.add("solid");

    // turn it off for now
    selectedDiv.style.display = "none";

    // done initializing
    return selectedDiv;
}