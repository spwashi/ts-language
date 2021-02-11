import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwEssenceNode extends SpwNode {
    private _body?: Set<SpwNode> = new Set<SpwNode>();

    get body() {
        return this._body;
    }

    set(key: keyof this, value: SpwNodeKeyValue): this {
        super.set(key, value);
        // assume this._body exists
        switch (key) {
            case 'body':
                if (!this._body) break;

                this._body.forEach(
                    node => {
                        node.setProp('parent', this)
                    },
                )
                return this;
        }
        return this;
    }

}