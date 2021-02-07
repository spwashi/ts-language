import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwNodeNode extends SpwNode {
    protected _node?: SpwNode;

    get node() {
        return this._node;
    }

    protected _essence?: SpwNode;

    get essence() {
        return this._essence;
    }

    protected _description?: SpwNode;

    get description() {
        return this._description;
    }

    set(key: keyof this, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'node':
                this._node = (value as SpwNode);
                return this;
            case 'essence':
                this._essence = (value as SpwNode);
                return this;
            case 'description':
                this._description = (value as SpwNode);
                return this;
        }
        super.set(key, value);
        return this;
    }

}