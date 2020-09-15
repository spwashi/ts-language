import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwConceptNode extends SpwNode {
    private _body?: Set<SpwNode> = new Set<SpwNode>();

    set(key: string, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'body':
                this._body = new Set<SpwNode>(value as Array<SpwNode>);
                return this;
        }
        super.set(key, value);
        return this;
    }

}