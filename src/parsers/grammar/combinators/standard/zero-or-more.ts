import {Combinator, ICombinator} from '../abstract';

export class ZeroOrMoreCombinator<Pattern extends ICombinator = ICombinator, Action = any> extends Combinator<Pattern, Action> {
    get pattern(): ICombinator {
        return this._pattern;
    }
}

export function zeroOrMoreOf<T extends ICombinator>(p: T) {
    return new ZeroOrMoreCombinator(p);
}