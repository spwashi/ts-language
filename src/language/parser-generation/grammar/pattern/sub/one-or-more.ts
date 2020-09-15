import {getParsingAction, ParsingActionOwner, PegJsMeta, Pattern, setComponentName, setPegJsAction} from '../pattern';

export class OneOrMorePattern implements Pattern, ParsingActionOwner {
    _pegjs: PegJsMeta = {};
    setAction         = setPegJsAction;
    setComponentName  = setComponentName;

    readonly #_pattern: Pattern;

    constructor(pattern: Pattern) {
        this.#_pattern = pattern;
    }


    get pattern(): Pattern {
        return this.#_pattern;
    }
}


