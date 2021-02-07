import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwPerformanceNode extends SpwNode {
    private _label?: SpwNode;

    get label() {
        return this._label;
    }

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