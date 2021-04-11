import {Combinator, ICombinator} from '../abstract';
import _ from 'lodash';


export interface CountableCombinator {count(): number;}

const truthy = (i: any) => !!i;

export class AnyCombinator<P extends ICombinator[] = ICombinator[], Action = any> extends Combinator<P, Action> implements CountableCombinator {
    get patterns() { return _.flatMap(this._pattern); }

    count(filter = truthy): number {
        const filtered = this.patterns.filter(filter);
        const length   = filtered.length;
        if (length === 1 && filtered[0]?.count) {
            return filtered[0].count(filter);
        }
        return length;
    }
}

export function anyOf<T extends ICombinator[]>(p: T) {
    return new AnyCombinator<T>(p);
}