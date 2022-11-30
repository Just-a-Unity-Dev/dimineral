export const inputs: {[id: string]: boolean} = {};

window.addEventListener("keydown", (ev) => {
    inputs[ev.key] = true;
});

window.addEventListener("keyup", (ev) => {
    inputs[ev.key] = false;
});