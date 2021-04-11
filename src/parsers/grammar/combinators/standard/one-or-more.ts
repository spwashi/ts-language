import {Combinator, ICombinator} from '../abstract';

export class OneOrMoreCombinator<Pattern extends ICombinator = ICombinator, Action = any> extends Combinator<Pattern, Action> {
    get pattern(): Pattern { return this._pattern; }
}

export function oneOrMoreOf<T extends ICombinator>(p: T) {
    return new OneOrMoreCombinator(p);
}