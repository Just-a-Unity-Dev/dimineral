import { play } from "./audio";

// Easily append multiple children to one element.
export function appendChilds(element: HTMLElement, nodes: Node[]) {
    nodes.forEach(node => {
        element.appendChild(node);
    });
}

// Quickly creates an element alongside other utility functions.
export function quickCreate(node: string, message?: string, image?: string): Node {
    const n = document.createElement(node);
    if (node == "button") {
        n.addEventListener("mouseenter", () => {
            play("sfx/select.wav");
        });
        n.addEventListener("mouseleave", () => {
            play("sfx/select.wav");
        });
        n.addEventListener("click", () => {
            play("sfx/sift.wav")
        })
    }
    if (node == "img" && image != undefined) {
        (n as HTMLImageElement).src = image;
    }
    if (message != undefined) {
        n.textContent = message;
    }
    return n;
}

export function addS(n: number, message: string): string {
    if (n == 1) {
        return message;
    }
    
    return message + "s";
}
