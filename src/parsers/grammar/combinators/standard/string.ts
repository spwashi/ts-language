import {Combinator} from '../abstract';

export class StringCombinator<Pattern extends string = string, Action = any> extends Combinator<Pattern, Action> {
    get chars(): string {
        return this._pattern;
    }
}

export function stringLike(p: string) {
    return new StringCombinator(p);
}