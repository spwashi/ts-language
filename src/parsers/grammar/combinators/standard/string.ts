import {Combinator} from '../abstract';

interface StringProps {chars: string;}

export class StringCombinator<Pattern extends string = string, Action = any> extends Combinator<Pattern, Action> {
    get chars(): string {
        return this._pattern;
    }
}

export const stringLike = (p: string) => new StringCombinator(p);