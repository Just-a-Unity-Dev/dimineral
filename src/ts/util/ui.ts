import { play } from "./audio";

// Easily append multiple children to one element.
export function appendChilds(element: HTMLElement, nodes: Node[]) {
    if (element == null)
        return;

    nodes.forEach(node => {
        element.appendChild(node);
    });
}

export function updateButton(button: HTMLButtonElement, disabled: boolean, show: boolean) {
    if (button != undefined) {
        button.disabled = disabled;
        button.style.display = show ? "block" : "none";
    }
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
