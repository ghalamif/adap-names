import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        this.components = [...source];
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.ensureIndex(i, this.components.length, false);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.ensureIndex(i, this.components.length, false);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.ensureIndex(i, this.components.length, true);
        this.components.splice(i, 0, c);
    }

    public remove(i: number): void {
        this.ensureIndex(i, this.components.length, false);
        this.components.splice(i, 1);
    }
}
