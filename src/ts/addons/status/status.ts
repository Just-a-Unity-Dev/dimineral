import { generateString } from "../../util/rng";
import { quickCreate } from "../../util/ui";

/**
 * Initializes the status bar for all status watchers to be in
 * @returns Node
 */
export function initStatusBar(): Node {
    const statusDetails = document.createElement("details");
    const statusSummary = document.createElement("summary");

    statusSummary.textContent = "Status";
    statusDetails.appendChild(statusSummary);
    
    statusDetails.open = true;
    statusDetails.id = "status"

    return statusDetails;
}

/**
 * A status watcher
 */
export class Status {
    private v: number | boolean | string = 0;
    public readonly name: string = "Epic Status";
    public readonly id: string = generateString(10);

    constructor(name: string, value: number | boolean | string) {
        this.name = name;
        this.v = value;
    }

    /**
     * Initializes the status
     * @returns Node
     */
    public init(): Node {
        const p = <HTMLParagraphElement>quickCreate("p");
        p.id = this.id;
        return p;
    }

    /**
     * Updates the UI of the status
     */
    public updateUi() {
        const p: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(this.id);

        if (p != null) {
            if (typeof this.v == "boolean") {
                if (this.v) {
                    p.innerHTML = "<strong>" + this.name + "</strong>: " + "Yes";
                } else {
                    p.innerHTML = "<strong>" + this.name + "</strong>: " + "No";
                }
            } else if (typeof this.v == "number") {
                p.innerHTML = "<strong>" + this.name + "</strong>: " + this.v.toLocaleString();
            } else {
                p.innerHTML = "<strong>" + this.name + "</strong>: " + this.value;
            }
        }
    }

    get value() {
        return this.v;
    }

    set value(value) {
        this.v = value;
        this.updateUi();
    }
}

export const statuses: Status[] = [];

/**
 * Create's a status easily
 * @param status Status
 */
export function addStatus(status: Status) {
    const statusBar = document.getElementById("status");
    statuses.push(status);
    statusBar?.appendChild(status.init());
    status.updateUi();
}

export function findStatus(name: string): Status | null {
    const status = statuses.find(s => s.name == name);
    if (status == undefined) return null;
    return status;
}
