import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

const escapeComponentForDelimiter = (component: string, delimiter: string): string =>
    component
        .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
        .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        this.ensureDelimiter(delimiter);
        this.delimiter = delimiter;
        this.components = [...source];
    }

    public asString(delimiter: string = this.delimiter): string {
        this.ensureDelimiter(delimiter);
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.components
            .map(component => escapeComponentForDelimiter(component, DEFAULT_DELIMITER))
            .join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.ensureIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.ensureIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.ensureIndex(i, true);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.ensureIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const otherLength = other.getNoComponents();
        for (let i = 0; i < otherLength; i++) {
            this.components.push(other.getComponent(i));
        }
    }

    private ensureDelimiter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new Error("delimiter must be a single char");
        }
    }

    private ensureIndex(index: number, allowEqualEnd = false): void {
        if (index < 0) {
            throw new RangeError("index must be not a negtive number");
        }
        if (allowEqualEnd) {
            if (index > this.components.length) {
                throw new RangeError("index out of bounds");
            }
            return;
        }
        if (index >= this.components.length) {
            throw new RangeError("index out of bonds");
        }
    }

}
