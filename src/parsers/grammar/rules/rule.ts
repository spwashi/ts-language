import {ICombinator} from '../combinators/abstract';
import {ParsingAction} from '../abstract/component';

export class Rule<P = ICombinator, A extends ParsingAction = ParsingAction<any>> {
    private readonly _ruleName: string;
    private readonly _pattern: P;
    private readonly _action: ParsingAction<A> | undefined;
    constructor(name: string, pattern: P, action?: ParsingAction<A>) {
        this._ruleName = name;
        this._pattern  = pattern;
        this._action   = action;
    }
    get ruleName(): string {
        return this._ruleName;
    }
    get pattern(): P {
        return this._pattern;
    }
    get action(): ParsingAction<A> | undefined {
        return this._action;
    }
    withAction<A>(value: A) {
        // @ts-ignore
        return new (this.constructor)(this);
    }
}