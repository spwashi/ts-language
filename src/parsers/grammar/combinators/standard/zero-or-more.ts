import {Combinator, ICombinator} from '../abstract';

export class ZeroOrMoreCombinator<Pattern extends ICombinator = ICombinator, Action = any> extends Combinator<Pattern, Action> {
    readonly isMultiplicityCombinator = true;
    get pattern(): ICombinator {
        return this._pattern;
    }
}

export const zeroOrMoreOf = (p: ICombinator) => new ZeroOrMoreCombinator(p);