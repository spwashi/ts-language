import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwDomainNode extends SpwNode {
    private _body?: string;

    set(key: string, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'body':
                this._body = (value as string);
                return this;
        }
        super.set(key, value);
        return this;
    }

}