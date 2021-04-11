import {Combinator, ICombinator} from '../abstract';

export class OptionalCombinator<Pattern extends ICombinator = ICombinator, Action = any> extends Combinator<Pattern, Action> {
    get pattern(): Pattern { return this._pattern; }
}

export function optionally<T extends ICombinator>(p: T) {
    return new OptionalCombinator(p);
}