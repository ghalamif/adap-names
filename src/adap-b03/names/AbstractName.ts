import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

const escapeComponentForDelimiter = (component: string, delimiter: string): string =>
    component
        .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
        .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.ensureDelimiter(delimiter);
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        this.ensureDelimiter(delimiter);
        const components: string[] = [];
        const len = this.getNoComponents();
        for (let i = 0; i < len; i++) {
            components.push(this.getComponent(i));
        }
        return components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const components: string[] = [];
        const len = this.getNoComponents();
        for (let i = 0; i < len; i++) {
            const c = this.getComponent(i);
            components.push(escapeComponentForDelimiter(c, DEFAULT_DELIMITER));
        }
        return components.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (this === other) {
            return true;
        }
        if (!other) {
            return false;
        }
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }

        const len = this.getNoComponents();
        if (len !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < len; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    public getHashCode(): number {
        const prime = 31;
        let hash = prime + this.delimiter.charCodeAt(0);
        const len = this.getNoComponents();
        for (let i = 0; i < len; i++) {
            const component = this.getComponent(i);
            for (let j = 0; j < component.length; j++) {
                hash = (hash * prime + component.charCodeAt(j)) | 0;
            }
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        const len = other.getNoComponents();
        for (let i = 0; i < len; i++) {
            this.append(other.getComponent(i));
        }
    }

    protected ensureDelimiter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new Error("delimiter must be a single char");
        }
    }

}