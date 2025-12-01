import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

const escapeComponentForDelimiter = (component: string, delimiter: string): string =>
    component
        .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
        .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertValidDelimiterAsPrecondition(delimiter);
        this.delimiter = delimiter;
        this.assertClassInvariant();
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        this.assertClassInvariant();
        this.assertValidDelimiterAsPrecondition(delimiter);
        return this.collectComponents().join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        this.assertClassInvariant();
        return this.collectComponents()
            .map(component => escapeComponentForDelimiter(component, DEFAULT_DELIMITER))
            .join(DEFAULT_DELIMITER);
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

    public abstract getNoComponents(): number;

    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;

    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

    public concat(other: Name): void {
        this.assertClassInvariant();
        IllegalArgumentException.assert(other !== null && other !== undefined, "other name must be provided");
        const original = this.getNoComponents();
        const otherComponents = other.getNoComponents();
        for (let i = 0; i < otherComponents; i++) {
            this.append(other.getComponent(i));
        }
        MethodFailedException.assert(
            this.getNoComponents() === original + otherComponents,
            "concat failed to append components"
        );
        this.assertClassInvariant();
    }

    protected ensureIndex(index: number, length: number, allowEqualEnd: boolean): void {
        IllegalArgumentException.assert(Number.isInteger(index), "component index must be an integer");
        IllegalArgumentException.assert(index >= 0, "component index must be non-negative");
        if (allowEqualEnd) {
            IllegalArgumentException.assert(index <= length, "component index out of bounds");
            return;
        }
        IllegalArgumentException.assert(index < length, "component index out of bounds");
    }

    protected assertValidDelimiterAsPrecondition(delimiter: string): void {
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
    }

    protected assertValidComponentAsPrecondition(component: string): void {
        IllegalArgumentException.assert(component !== null && component !== undefined, "component must be provided");
    }

    protected assertClassInvariant(): void {
        InvalidStateException.assert(this.delimiter.length === 1, "delimiter must be a single character");
        const count = this.getNoComponents();
        InvalidStateException.assert(Number.isInteger(count) && count >= 0, "component count must be non-negative");
    }

    private collectComponents(): string[] {
        const len = this.getNoComponents();
        const result: string[] = [];
        for (let i = 0; i < len; i++) {
            result.push(this.getComponent(i));
        }
        return result;
    }

}
