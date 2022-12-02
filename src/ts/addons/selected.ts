import { play } from "../util/audio";
import { quickCreate } from "../util/ui";
import { Character } from "./humanoid/character";
import { inputs } from './input';

export let selected: Character | null = null;

export function setSelected(character: Character | null, override = false) {
    if (character == null && inputs["Shift"] && !override) return;
    selected = character;
}

/**
 * Initializes the selected div
 */
export function initSelectedDiv(): HTMLDivElement {
    const selectedDiv = <HTMLDivElement>quickCreate("div");

    // basic name
    const name = <HTMLHeadingElement>quickCreate("h2");
    name.textContent = <string>selected?.name;
    name.id = "selected-name";

    // deselect button
    const deselect = <HTMLButtonElement>quickCreate("button", "Deselect");

    // this overwrites the previous onclick to prevent repeats
    deselect.onclick = function () {
        // deselected
        play("sfx/sift.wav")
        setSelected(null, true);
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