import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwEssenceNode extends SpwNode {
    get body() {
        return this._body;
    }
    private _body?: Set<SpwNode> = new Set<SpwNode>();

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