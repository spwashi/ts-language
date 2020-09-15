import {ParsingAction, Pattern} from '../pattern/pattern';

export class Rule {
    private readonly _ruleName: string;
    private readonly _pattern: Pattern;
    private readonly _action: ParsingAction | undefined;

    constructor(name: string, pattern: Pattern, action?: ParsingAction) {
        this._ruleName = name;
        this._pattern  = pattern;
        this._action   = action;
    }

    get ruleName(): string {
        return this._ruleName;
    }

    get pattern(): Pattern {
        return this._pattern;
    }

    get action(): ParsingAction | undefined {
        return this._action;
    }
}

export const rule =
                 (name: string, pattern: Pattern, action?: string | undefined) =>
                     new Rule(name, pattern, action)
