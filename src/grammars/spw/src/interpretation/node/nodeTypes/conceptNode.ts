import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwConceptNode extends SpwNode {
    protected _body?: Set<SpwNode> = new Set<SpwNode>();

    get body() {
        return this._body;
    }

    set(key: keyof this, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'body':
                this._body = new Set<SpwNode>(value as Array<SpwNode>);
                return this;
        }
        super.set(key, value);
        return this;
    }

}