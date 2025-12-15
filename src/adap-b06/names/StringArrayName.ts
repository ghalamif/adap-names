import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    private readonly components: readonly string[];

    constructor(source: string[], delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        IllegalArgumentException.assert(source !== null && source !== undefined, "components must be provided");
        this.components = [...source];
        this.assertClassInvariant();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertClassInvariant();
        this.ensureIndex(i, this.components.length, false);
        return this.components[i];
    }

    protected createFromComponents(components: readonly string[], delimiter: string): Name {
        return new StringArrayName([...components], delimiter);
    }

    protected override assertClassInvariant(): void {
        super.assertClassInvariant();
        InvalidStateException.assert(
            Number.isInteger(this.components.length) && this.components.length >= 0,
            "component list length must be non-negative"
        );
    }

}
