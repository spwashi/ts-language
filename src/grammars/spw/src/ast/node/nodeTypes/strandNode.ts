import {SpwNode, SpwNodeKeyValue} from '../spwNode';
import {SpwNodeNode} from './nodeNode';

type SpwStrandTail = SpwNode & { node: SpwNodeNode, transport: SpwNode };
type ConjunctionArr = Array<SpwStrandTail | SpwNode>;

export class SpwStrandNode extends SpwNode {
    private _head?: SpwNode;

    get head() {
        return this._head;
    }

    private _tail?: SpwNode;

    get tail() {
        return this._tail;
    }

    private _conjunction?: ConjunctionArr;

    get conjunction() {
        return this._conjunction;
    }

    set(key: keyof this, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'head':
                this._head = (value as SpwNode);
                this._head.setProp('parent', this);
                return this;
            case 'tail':
                if (!Array.isArray(value)) {
                    throw new Error('Not sure how to handle this tail')
                }
                const lastIndex = value.length - 1;
                const last      = value[lastIndex] as SpwStrandTail;
                this._tail      = last.node;
                this._tail.setProp('parent', this);
                this._conjunction =
                    (value as SpwStrandTail[])
                        .reduce(
                            (arr: ConjunctionArr, curr: SpwStrandTail, i) => {
                                let next = [...arr, curr.transport];
                                if (i !== lastIndex) {
                                    next.push(curr.node);
                                }
                                curr.node.setProp('parent', this);
                                return next;
                            },
                            [],
                        );
                return this;
        }

        if (this._head && this._tail) {
            if (!this._conjunction?.length) {
                this._head.setProp('next', this._tail)
                this._tail.setProp('prev', this._head)
            } else {
                const nodes = []
                this._conjunction.reduce(
                    (prev, curr, i) => {
                        curr.setProp('prev', prev);
                        prev.setProp('next', curr);
                        return curr;
                    },
                    this._head,
                )
            }

        }

        super.set(key, value);
        return this;
    }
}