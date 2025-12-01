import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        IllegalArgumentException.assert(source !== null && source !== undefined, "components must be provided");
        this.components = [...source];
        this.assertClassInvariant();
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertClassInvariant();
        this.ensureIndex(i, this.components.length, false);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertValidComponentAsPrecondition(c);
        this.assertClassInvariant();
        this.ensureIndex(i, this.components.length, false);
        this.components[i] = c;
        this.assertClassInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertValidComponentAsPrecondition(c);
        this.assertClassInvariant();
        this.ensureIndex(i, this.components.length, true);
        this.components.splice(i, 0, c);
        this.assertClassInvariant();
    }

    public append(c: string): void {
        const previousLength = this.components.length;
        this.insert(previousLength, c);
        MethodFailedException.assert(this.components.length === previousLength + 1, "append failed");
    }

    public remove(i: number): void {
        this.assertClassInvariant();
        this.ensureIndex(i, this.components.length, false);
        this.components.splice(i, 1);
        this.assertClassInvariant();
    }

    protected override assertClassInvariant(): void {
        super.assertClassInvariant();
        InvalidStateException.assert(
            Number.isInteger(this.components.length) && this.components.length >= 0,
            "component list length must be non-negative"
        );
    }
}
