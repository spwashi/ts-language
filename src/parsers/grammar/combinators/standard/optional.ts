import {Combinator, ICombinator} from '../abstract';

interface OptionalCombinatorProps {pattern: ICombinator;}

export class OptionalCombinator<Pattern extends ICombinator = ICombinator, Action = any> extends Combinator<Pattern, Action> {
    get pattern(): Pattern { return this._pattern; }
}

export const optionally = (p: ICombinator) => new OptionalCombinator(p);