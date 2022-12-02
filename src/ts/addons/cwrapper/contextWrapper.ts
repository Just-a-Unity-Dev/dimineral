import { quickCreate } from '../../util/ui';

export const contextWrapper: HTMLDivElement = initContextWrapper();

export function log(div: HTMLDivElement, message: string) {
    div.append(quickCreate("p", message))
}

export function initContextWrapper(): HTMLDivElement {
    const div = <HTMLDivElement>quickCreate("div");
    div.classList.add("cwrapper");

    log(div, "ContextWrapper initialized.");

    return div;
}