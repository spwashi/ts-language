import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwNodeNode extends SpwNode {
    private _node?: SpwNode;
    private _essence?: SpwNode;
    private _description?: SpwNode;

    set(key: string, value: SpwNodeKeyValue): this {
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