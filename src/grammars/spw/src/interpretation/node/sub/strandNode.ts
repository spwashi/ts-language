import {SpwNode, SpwNodeKeyValue} from '../spwNode';
import {SpwNodeNode} from './nodeNode';

type SpwStrandTail = SpwNode & { node: SpwNodeNode, transport: SpwNode };
type ConjunctionArr = Array<SpwStrandTail | SpwNode>;

export class SpwStrandNode extends SpwNode {
    private _head?: SpwNode;
    private _tail?: SpwNode;
    private _conjunction?: ConjunctionArr;

    set(key: string, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'head':
                this._head = (value as SpwNode);
                return this;
            case 'tail':
                if (!Array.isArray(value)) {
                    throw new Error('Not sure how to handle this tail')
                }
                const lastIndex   = value.length - 1;
                const last        = value[lastIndex] as SpwStrandTail;
                this._tail        = last?.node;
                this._conjunction = (value as SpwStrandTail[])
                    .reduce(
                        (arr: ConjunctionArr, curr, i) => {
                            return [...arr, i === lastIndex ? curr.transport : curr];
                        },
                        [],
                    );
                return this;
        }
        super.set(key, value);
        return this;
    }
}