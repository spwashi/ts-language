import {SpwNode, SpwNodeKeyValue} from '../spwNode';

export class SpwAnchorNode extends SpwNode {
    get key(): string {
        let key = super.key;
        if (!key) return '&';
        return key;
    }

    set(key: string, value: SpwNodeKeyValue): this {
        super.set(key, value);
        return this;
    }
}