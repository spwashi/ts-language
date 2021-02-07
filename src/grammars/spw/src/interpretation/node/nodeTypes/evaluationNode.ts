import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwEvaluationNode extends SpwNode {
    get label() {
        return this._label;
    }
    private _label?: SpwNode;

    set(key: keyof this, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'label':
                this._label = (value as SpwNode);
                return this;
        }
        super.set(key, value);
        return this;
    }

}