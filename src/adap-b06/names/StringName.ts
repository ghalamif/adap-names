import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    private readonly name: string;
    private readonly noComponents: number;

    constructor(source: string = "", delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        IllegalArgumentException.assert(source !== null && source !== undefined, "source string must be provided");
        this.name = source;
        this.noComponents = source.length === 0 ? 0 : this.buildComponentListFrom(source).length;
        this.assertClassInvariant();
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

    protected createFromComponents(components: readonly string[], delimiter: string): Name {
        const rendered = components.length === 0 ? "" : components
            .map(component =>
                component
                    .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                    .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter)
            )
            .join(delimiter);
        return new StringName(rendered, delimiter);
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

    protected override assertClassInvariant(): void {
        super.assertClassInvariant();
        InvalidStateException.assert(this.noComponents >= 0, "component count must be non-negative");
        InvalidStateException.assert(Number.isInteger(this.noComponents), "component count must be integer");
        const actual = this.name.length === 0 ? 0 : this.buildComponentListFrom(this.name).length;
        InvalidStateException.assert(actual === this.noComponents, "component count mismatch");
    }

}
