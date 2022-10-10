export function quickCreate(node: string, message?: string): Node {
    let n = document.createElement(node);
    if (message != undefined) n.textContent = message;
    return n;
}
