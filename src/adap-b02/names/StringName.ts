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

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        this.ensureDelimiter(delimiter);
        this.delimiter = delimiter;
        this.name = source;
        this.parseComponents();  
    }

    public asString(delimiter: string = this.delimiter): string {
        this.ensureDelimiter(delimiter);
        const components = this.parseComponents();
        if (components.length === 0) {
            return "";
        }
        return components.join(delimiter);
    }

    public asDataString(): string {
        return this.parseComponents()
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

    public getComponent(index: number): string {
        const components = this.parseComponents();
        this.ensureIndex(index, components.length);
        return components[index];
    }

    public setComponent(index: number, value: string): void {
        const components = this.parseComponents();
        this.ensureIndex(index, components.length);
        components[index] = value;
        this.rebuildFromComponents(components);
    }

    public insert(index: number, value: string): void {
        const components = this.parseComponents();
        this.ensureIndex(index, components.length, true);
        components.splice(index, 0, value);
        this.rebuildFromComponents(components);
    }

    public append(value: string): void {
        const components = this.parseComponents();
        components.push(value);
        this.rebuildFromComponents(components);
    }

    public remove(index: number): void {
        const components = this.parseComponents();
        this.ensureIndex(index, components.length);
        components.splice(index, 1);
        this.rebuildFromComponents(components);
    }

    public concat(other: Name): void {
        const components = this.parseComponents();
        const otherLength = other.getNoComponents();
        for (let i = 0; i < otherLength; i++) {
            components.push(other.getComponent(i));
        }
        this.rebuildFromComponents(components);
    }

    private ensureDelimiter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new Error("delimiter must be a single char");
        }
    }

    private ensureIndex(index: number, length: number, allowEqualEnd = false): void {
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

    private parseComponents(): string[] {
        if (this.name.length === 0) {
            this.noComponents = 0;
            return [];
        }

        const components: string[] = [];
        let currentComponent = "";
        let escapeActive = false;

        for (const char of this.name) {
            if (escapeActive) {
                currentComponent += char;
                escapeActive = false;
                continue;
            }
            if (char === ESCAPE_CHARACTER) {
                currentComponent += char;
                escapeActive = true;
                continue;
            }
            if (char === this.delimiter) {
                components.push(currentComponent);
                currentComponent = "";
                continue;
            }
            currentComponent += char;
        }

        components.push(currentComponent);
        this.noComponents = components.length;
        return components;
    }

    private rebuildFromComponents(components: string[]): void {
        this.noComponents = components.length;
        if (components.length === 0) {
            this.name = "";
            return;
        }
        this.name = components.join(this.delimiter);
    }

}
