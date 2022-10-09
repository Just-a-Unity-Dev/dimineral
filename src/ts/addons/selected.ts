export let selected: string = "";

export function setSelected(name: string) {
    selected = name;
}

/**
 * Initializes the selected div
 */
export function initSelectedDiv(): Node {
    let selectedDiv = document.createElement("div");

    // basic name
    let name = document.createElement("h2");
    name.textContent = selected;
    name.id = "selected-name";

    // deselect button
    let deselect = document.createElement("button");
    deselect.textContent = "Deselect";

    // this overwrites the previous onclick to prevent repeats
    deselect.onclick = function () {
        // deselected
        setSelected("");
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