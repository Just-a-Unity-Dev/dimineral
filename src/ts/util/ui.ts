import { play } from "./audio";

export function quickCreate(node: string, message?: string): Node {
    const n = document.createElement(node);
    if (node == "button") {
        n.addEventListener("mouseenter", () => {
            play("select.wav");
        });
        n.addEventListener("mouseleave", () => {
            play("select.wav");
        });
    }
    if (message != undefined) {
        n.textContent = message;
    };
    return n;
}

export function addS(n: number, message: string): string {
    if (n == 1) {
        return message;
    }
    
    return message + "s";
}
