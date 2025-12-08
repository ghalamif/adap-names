import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

import { Name } from "../names/Name";
import type { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; 
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    protected getChildNodes(): Iterable<Node> {
        return [];
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(bn.length > 0, "base name must not be empty");

        const matches: Set<Node> = new Set<Node>();
        const isServiceBoundary: boolean = Node.isRootNode(this);

        try {
            Node.collectMatchingNodes(this, bn, matches);
        } catch (error: unknown) {
            if (error instanceof IllegalArgumentException) {
                throw error;
            }

            if (isServiceBoundary) {
                throw Node.asServiceFailure(error);
            }

            throw error;
        }

        return matches;
    }

    private static collectMatchingNodes(node: Node, targetBaseName: string, matches: Set<Node>): void {
        const actualBaseName: string = node.getBaseName();
        Node.ensureValidBaseName(node, actualBaseName);

        if (actualBaseName === targetBaseName) {
            matches.add(node);
        }

        for (const child of node.getChildNodes()) {
            Node.collectMatchingNodes(child, targetBaseName, matches);
        }
    }

    private static ensureValidBaseName(node: Node, baseName: string): void {
        if (Node.isRootNode(node)) {
            return;
        }

        InvalidStateException.assert(baseName.length > 0, "node base name must not be empty");
    }

    private static isRootNode(node: Node): boolean {
        return node.parentNode === node;
    }

    private static asServiceFailure(error: unknown): ServiceFailureException {
        if (error instanceof ServiceFailureException) {
            return error;
        }

        if (error instanceof Exception) {
            return new ServiceFailureException("findNodes failed", error);
        }

        const message: string = error instanceof Error ? error.message : "unexpected runtime error";
        const trigger: InvalidStateException = new InvalidStateException(message);
        return new ServiceFailureException("findNodes failed", trigger);
    }

}
