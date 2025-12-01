import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Directory } from "./Directory";
import { Node } from "./Node";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.state === FileState.CLOSED, "file must be closed to open");
        this.state = FileState.OPEN;
        MethodFailedException.assert(this.state === FileState.OPEN, "file failed to open");
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(Number.isInteger(noBytes), "number of bytes must be integer");
        IllegalArgumentException.assert(noBytes >= 0, "number of bytes must be non-negative");
        IllegalArgumentException.assert(this.state === FileState.OPEN, "file must be open to read");
        const buffer = new Int8Array(noBytes);
        MethodFailedException.assert(buffer.length === noBytes, "read failed to deliver requested bytes");
        return buffer;
    }

    public close(): void {
        IllegalArgumentException.assert(this.state === FileState.OPEN, "file must be open to close");
        this.state = FileState.CLOSED;
        MethodFailedException.assert(this.state === FileState.CLOSED, "file failed to close");
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}
