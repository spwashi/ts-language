import {Combinator, ICombinator} from '../abstract';

export class RuleReferenceCombinator<P extends string = string, Action = any> extends Combinator<P, Action> {
    get ruleName(): string {
        return this._pattern;
    }
}

export const referenceTo = (p: string) => new RuleReferenceCombinator(p);

