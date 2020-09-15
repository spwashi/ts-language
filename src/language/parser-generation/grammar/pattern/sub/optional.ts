import {getParsingAction, ParsingActionOwner, PegJsMeta, Pattern, setComponentName, setPegJsAction} from '../pattern';

export class OptionalPattern implements Pattern, ParsingActionOwner {
    _pegjs: PegJsMeta = {};
    setAction         = setPegJsAction;
    setComponentName  = setComponentName;
    readonly #pattern: Pattern;

    constructor(pattern: Pattern) {
        this.#pattern = pattern;
    }

    get pattern() {
        return this.#pattern;
    }
}


