import {Combinator} from '../abstract';

export class RegularExpressionCombinator<Pattern extends string = string, Action = any> extends Combinator<Pattern, Action> {
    get chars(): string {
        return this._pattern;
    }
}

export function regExpLike(p: string) {
    return new RegularExpressionCombinator(p);
}