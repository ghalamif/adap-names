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

    protected readonly delimiter: string = DEFAULT_DELIMITER;

    protected constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertValidDelimiterAsPrecondition(delimiter);
        this.delimiter = delimiter;
    }

    public clone(): Name {
        this.assertClassInvariant();
        return this.createFromComponents(this.collectComponents(), this.delimiter);
    }

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

    public isEqual(other: Object): boolean {
        if (this === other) {
            return true;
        }
        if (!this.isNameCandidate(other)) {
            return false;
        }
        const otherName = other as Name;
        if (this.getDelimiterCharacter() !== otherName.getDelimiterCharacter()) {
            return false;
        }
        const len = this.getNoComponents();
        if (len !== otherName.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < len; i++) {
            if (this.getComponent(i) !== otherName.getComponent(i)) {
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

    public setComponent(i: number, c: string): Name {
        this.assertClassInvariant();
        this.assertValidComponentAsPrecondition(c);
        const components = this.collectComponents();
        this.ensureIndex(i, components.length, false);
        components[i] = c;
        return this.createFromComponents(components, this.delimiter);
    }

    public insert(i: number, c: string): Name {
        this.assertClassInvariant();
        this.assertValidComponentAsPrecondition(c);
        const components = this.collectComponents();
        this.ensureIndex(i, components.length, true);
        components.splice(i, 0, c);
        return this.createFromComponents(components, this.delimiter);
    }

    public append(c: string): Name {
        this.assertClassInvariant();
        const previous = this.getNoComponents();
        const result = this.insert(previous, c);
        MethodFailedException.assert(result.getNoComponents() === previous + 1, "append failed");
        return result;
    }

    public remove(i: number): Name {
        this.assertClassInvariant();
        const components = this.collectComponents();
        this.ensureIndex(i, components.length, false);
        components.splice(i, 1);
        return this.createFromComponents(components, this.delimiter);
    }

    public concat(other: Name): Name {
        this.assertClassInvariant();
        IllegalArgumentException.assert(other !== null && other !== undefined, "other name must be provided");
        const leftComponents = this.collectComponents();
        const rightComponents = AbstractName.collectComponentsFrom(other);
        const result = this.createFromComponents(leftComponents.concat(rightComponents), this.delimiter);
        MethodFailedException.assert(
            result.getNoComponents() === this.getNoComponents() + other.getNoComponents(),
            "concat failed to append components"
        );
        return result;
    }

    protected abstract createFromComponents(components: readonly string[], delimiter: string): Name;

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
        this.assertClassInvariant();
        const len = this.getNoComponents();
        const result: string[] = [];
        for (let i = 0; i < len; i++) {
            result.push(this.getComponent(i));
        }
        return result;
    }

    private static collectComponentsFrom(name: Name): string[] {
        const len = name.getNoComponents();
        const result: string[] = [];
        for (let i = 0; i < len; i++) {
            result.push(name.getComponent(i));
        }
        return result;
    }

    private isNameCandidate(other: Object): other is Name {
        if (other === null || other === undefined) {
            return false;
        }
        if (typeof other !== "object") {
            return false;
        }
        const candidate = other as Name;
        return typeof candidate.getNoComponents === "function"
            && typeof candidate.getComponent === "function"
            && typeof candidate.getDelimiterCharacter === "function";
    }

}
