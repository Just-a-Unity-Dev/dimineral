import { generateString } from "../../util/rng";
import { quickCreate } from "../../util/ui";

export function initStatusBar(): Node {
    const statusDetails = document.createElement("details");
    const statusSummary = document.createElement("summary");

    statusSummary.textContent = "Status";
    statusDetails.appendChild(statusSummary);
    
    statusDetails.open = true;
    statusDetails.id = "status"

    return statusDetails;
}

export class Status {
    private v: number | boolean = 0;
    public readonly name: string = "Epic Status";
    public readonly id: string = generateString(10);

    constructor(name: string, value: number | boolean) {
        this.name = name;
        this.v = value;
    }

    public init(): Node {
        const p = quickCreate("p");
        return p;
    }

    public updateUi() {
        const p: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(this.id);

        if (p != null) {
            if (typeof this.v == "boolean") {
                if (this.v) {
                    p.textContent = this.name + " " + "Yes";
                } else {
                    p.textContent = this.name + " " + "No";
                }
            } else {
                p.textContent = this.name + " " + this.v.toLocaleString();
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
