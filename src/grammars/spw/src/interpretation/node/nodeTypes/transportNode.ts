import {SpwNode, SpwNodeKeyValue} from '../spwNode';

class TransportBehavior {
    private readonly _key: string;

    constructor(key: string) {
        this._key = key;
    }

    get key(): string {
        return this._key;
    }
}

export class SpwTransportNode extends SpwNode {
    private _behavior?: TransportBehavior;

    set(key: keyof this, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'basis':
                switch (value) {
                    case '=>':
                        this._behavior = new TransportBehavior(value)
                }
                return this;
        }
        super.set(key, value);
        return this;
    }

}