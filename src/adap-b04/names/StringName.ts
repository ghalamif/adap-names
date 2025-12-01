import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string = "", delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        IllegalArgumentException.assert(source !== null && source !== undefined, "source string must be provided");
        this.name = source;
        this.noComponents = source.length === 0 ? 0 : this.buildComponentListFrom(source).length;
        this.assertClassInvariant();
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertClassInvariant();
        const components = this.buildComponentList();
        this.ensureIndex(i, components.length, false);
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertValidComponentAsPrecondition(c);
        const components = this.buildComponentList();
        this.ensureIndex(i, components.length, false);
        components[i] = c;
        this.updateFromComponents(components);
    }

    public insert(i: number, c: string): void {
        this.assertValidComponentAsPrecondition(c);
        const components = this.buildComponentList();
        this.ensureIndex(i, components.length, true);
        components.splice(i, 0, c);
        this.updateFromComponents(components);
    }

    public append(c: string): void {
        const previous = this.noComponents;
        this.insert(previous, c);
        MethodFailedException.assert(this.noComponents === previous + 1, "append failed");
    }

    public remove(i: number): void {
        const components = this.buildComponentList();
        this.ensureIndex(i, components.length, false);
        components.splice(i, 1);
        this.updateFromComponents(components);
    }

    private buildComponentList(): string[] {
        return this.buildComponentListFrom(this.name);
    }

    private buildComponentListFrom(value: string): string[] {
        if (value.length === 0) {
            return [];
        }
        const components: string[] = [];
        let current = "";
        let escapeActive = false;
        for (const ch of value) {
            if (escapeActive) {
                current += ch;
                escapeActive = false;
                continue;
            }
            if (ch === ESCAPE_CHARACTER) {
                escapeActive = true;
                continue;
            }
            if (ch === this.delimiter) {
                components.push(current);
                current = "";
                continue;
            }
            current += ch;
        }
        InvalidStateException.assert(!escapeActive, "dangling escape sequence in name");
        components.push(current);
        return components;
    }

    private updateFromComponents(components: string[]): void {
        if (components.length === 0) {
            this.name = "";
        } else {
            const escaped = components.map(component =>
                component
                    .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                    .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
            );
            this.name = escaped.join(this.delimiter);
        }
        this.noComponents = components.length;
        this.assertClassInvariant();
    }

    protected override assertClassInvariant(): void {
        super.assertClassInvariant();
        InvalidStateException.assert(this.noComponents >= 0, "component count must be non-negative");
        InvalidStateException.assert(Number.isInteger(this.noComponents), "component count must be integer");
        const actual = this.buildComponentListFrom(this.name).length;
        InvalidStateException.assert(actual === this.noComponents, "component count mismatch");
    }

}
