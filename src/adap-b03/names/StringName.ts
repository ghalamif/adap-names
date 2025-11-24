import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected raw: string = "";

    constructor(raw: string = "", delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.raw = raw;
    }

    // Utility helpers
    private parts(): string[] {
        if (this.raw === "") return [];

        const components: string[] = [];
        let current = "";
        let escapeActive = false;

        for (const ch of this.raw) {
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

        components.push(current);
        return components;
    }

    private update(parts: string[]): void {
        const escaped = parts.map(p =>
            p
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
        );
        this.raw = escaped.join(this.delimiter);
    }

    // ---- Primitive Methods ----

    protected doGetLength(): number {
        return this.parts().length;
    }

    protected doGetComponent(index: number): string {
        const p = this.parts();
        this.ensureIndex(index, p.length, false);
        return p[index];
    }

    protected doSetComponent(index: number, c: string): void {
        let p = this.parts();
        this.ensureIndex(index, p.length, false);
        p[index] = c;
        this.update(p);
    }

    protected doInsert(index: number, c: string): void {
        let p = this.parts();
        this.ensureIndex(index, p.length, true);
        p.splice(index, 0, c);
        this.update(p);
    }

    protected doRemove(index: number): void {
        let p = this.parts();
        this.ensureIndex(index, p.length, false);
        p.splice(index, 1);
        this.update(p);
    }

    // ---- Implement abstract methods from AbstractName ----

    public getNoComponents(): number {
        return this.doGetLength();
    }

    public getComponent(i: number): string {
        return this.doGetComponent(i);
    }

    public setComponent(i: number, c: string): void {
        this.doSetComponent(i, c);
    }

    public insert(i: number, c: string): void {
        this.doInsert(i, c);
    }

    public remove(i: number): void {
        this.doRemove(i);
    }

    public clone() {
        return new StringName(this.raw, this.delimiter);
    }

}
