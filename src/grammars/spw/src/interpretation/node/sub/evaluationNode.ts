import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwEvaluationNode extends SpwNode {
    private _label?: SpwNode;

    set(key: string, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'label':
                this._label = (value as SpwNode);
                return this;
        }
        super.set(key, value);
        return this;
    }

}