import {ParsingActionOwner, Pattern, PegJsMeta, setComponentName, setPegJsAction} from '../pattern';

export class RuleReferencePattern implements Pattern, ParsingActionOwner {
    _pegjs: PegJsMeta = {};
    setAction         = setPegJsAction;
    setComponentName  = setComponentName;

    readonly #_ruleName: string;

    constructor(ruleName: string) {
        this.#_ruleName = ruleName;
    }

    get ruleName(): string {
        return this.#_ruleName;
    }
}

