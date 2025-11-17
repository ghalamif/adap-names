import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
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

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.ensureIndex(i, this.components.length, false);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.ensureIndex(i, this.components.length, false);
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.ensureIndex(i, this.components.length, true);
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        this.ensureIndex(i, this.components.length, false);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        super.concat(other);
    }

    private ensureIndex(index: number, length: number, allowEqualEnd: boolean): void {
        if (index < 0) {
            throw new RangeError("index must not be negative");
        }
        if (allowEqualEnd) {
            if (index > length) {
                throw new RangeError("index out of bounds");
            }
        } else {
            if (index >= length) {
                throw new RangeError("index out of bounds");
            }
        }
    }
}