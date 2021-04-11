import {Combinator, ICombinator} from '../abstract';

export class OneOrMoreCombinator<Pattern extends ICombinator = any, Action = any> extends Combinator<Pattern, Action> {
    get pattern(): Pattern { return this._pattern; }
}

export const oneOrMoreOf = (p: ICombinator) => new OneOrMoreCombinator(p);