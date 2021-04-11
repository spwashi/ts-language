import {Combinator} from '../abstract';

export class RegularExpressionCombinator<Pattern extends string = string, Action = any> extends Combinator<Pattern, Action> {
    get chars(): string {
        return this._pattern;
    }
}

export const regExpLike = (p: string) => new RegularExpressionCombinator(p);