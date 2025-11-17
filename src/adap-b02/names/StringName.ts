import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

const escapeComponentForDelimiter = (component: string, delimiter: string): string =>
    component
        .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
        .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        const d = delimiter ?? DEFAULT_DELIMITER;
        this.ensureDelimiter(d);
        this.delimiter = d;
        this.name = source;
        this.noComponents = source.length === 0 ? 0 : this.splitComponents().length;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.ensureDelimiter(delimiter);
        if (delimiter === this.delimiter) {
            return this.name;
        }
        const components = this.splitComponents();
        return components.join(delimiter);
    }

    public asDataString(): string {
        const components = this.splitComponents();
        return components
            .map(component => escapeComponentForDelimiter(component, DEFAULT_DELIMITER))
            .join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(n: number): string {
        const components = this.splitComponents();
        this.ensureIndex(n, components.length, false);
        return components[n];
    }

    public setComponent(n: number, c: string): void {
        const components = this.splitComponents();
        this.ensureIndex(n, components.length, false);
        components[n] = c;
        this.updateFromComponents(components);
    }

    public insert(n: number, c: string): void {
        const components = this.splitComponents();
        this.ensureIndex(n, components.length, true);
        components.splice(n, 0, c);
        this.updateFromComponents(components);
    }

    public append(c: string): void {
        const components = this.splitComponents();
        components.push(c);
        this.updateFromComponents(components);
    }

    public remove(n: number): void {
        const components = this.splitComponents();
        this.ensureIndex(n, components.length, false);
        components.splice(n, 1);
        this.updateFromComponents(components);
    }

    public concat(other: Name): void {
        const components = this.splitComponents();
        const otherLen = other.getNoComponents();
        for (let i = 0; i < otherLen; i++) {
            components.push(other.getComponent(i));
        }
        this.updateFromComponents(components);
    }

    private splitComponents(): string[] {
        if (this.name.length === 0) {
            return [];
        }
        return this.name.split(this.delimiter);
    }

    private updateFromComponents(components: string[]): void {
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    private ensureDelimiter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new Error("delimiter must be a single char");
        }
    }

    private ensureIndex(index: number, length: number, allowEqualEnd: boolean): void {
        if (index < 0) {
            throw new RangeError("index must be not a negtive number");
        }
        if (allowEqualEnd) {
            if (index > length) {
                throw new RangeError("index out of bonds");
            }
            return;
        }
        if (index >= length) {
            throw new RangeError("index out of bonds");
        }
    }

}