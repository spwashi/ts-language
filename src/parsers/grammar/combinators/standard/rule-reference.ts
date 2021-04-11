import {Combinator} from '../abstract';

export class RuleReferenceCombinator<P extends string = string, Action = any> extends Combinator<P, Action> {
    get ruleName(): string {
        return this._pattern;
    }
}

export function referenceTo(p: string) {
    return new RuleReferenceCombinator(p);
}

