import {Combinator, ICombinator} from '../abstract';
import {CountableCombinator} from './any';

/**
 * A set of patterns, one after the other
 */
export class SequenceCombinator<Pattern extends ICombinator[] = ICombinator[], Action = any> extends Combinator<Pattern, Action> implements CountableCombinator {
    get patterns(): ICombinator[] {
        return this._pattern;
    }

    count(filter = (i: any) => !!i): number {
        return this._pattern.filter(filter).length;
    }
}

export function sequenceOf<P extends ICombinator[]>(p: P) {
    return new SequenceCombinator<P>(p);
}