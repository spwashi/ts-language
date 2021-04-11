import _ from 'lodash';
import {ParsingAction, RuleComponent, RuleComponentMeta} from '../../abstract/component';

export interface ICombinator<Pattern = any, Action = any> extends RuleComponent<Action> {
}

export class Combinator<Pattern = unknown, Action = ParsingAction> implements ICombinator<Pattern, Action> {
    meta: RuleComponentMeta<Action> = {};
    _pattern: Pattern;
    // set the name of the pattern for the closure it's associated with
    constructor(patterns: Pattern) { this._pattern = patterns; }

    named(value: string): this {
        const instance = new (<typeof Combinator>this.constructor)(this._pattern);
        instance.meta  = Object.assign(_.cloneDeep(this.meta), {name: value});
        return instance as this;
    }
    withAction<NextAction>(value: NextAction): this {
        const instance = new (<typeof Combinator>this.constructor)(this._pattern);
        instance.meta  = Object.assign(_.cloneDeep(this.meta), {action: value});
        return instance as this;
    }
}

export interface ParsingActionOwner<A = unknown> extends ICombinator<A> {
    meta: RuleComponentMeta<A>;

}

export function setComponentName<T extends ICombinator>(this: T, value: string): T {
    // @ts-ignore
    const instance: T = new (this.constructor)(this);
    instance.meta     = Object.assign(_.cloneDeep(this.meta), {name: value});
    return instance
}
export function getParsingAction(item: ParsingActionOwner): ParsingAction { return item.meta.action; }
export function getComponentName(item: RuleComponent): string | undefined { return item.meta?.name; }

